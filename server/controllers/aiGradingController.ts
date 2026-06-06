import { Request, Response } from 'express';
import TestResult from '../models/TestResult';
import Test from '../models/Test';
import { gradeWritingAnswer } from '../services/aiGradingService';

// Auto-grade a writing answer using AI
export const autoGradeWritingAnswer = async (req: Request, res: Response) => {
  try {
    const { resultId, questionIndex } = req.body;

    const result = await TestResult.findById(resultId).populate('testId');
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    const test = result.testId as any;
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const question = test.questions[parseInt(questionIndex)];
    if (!question || question.type !== 'writing') {
      return res.status(400).json({ message: 'Invalid question or not a writing question' });
    }

    const answer = result.writingAnswers?.[questionIndex];
    if (!answer) {
      return res.status(400).json({ message: 'No answer found for this question' });
    }

    // Use AI to grade the answer
    const gradingResult = await gradeWritingAnswer(question, answer);

    // Save the grade
    if (!result.writingGrades) {
      result.writingGrades = {};
    }

    (result.writingGrades as any)[parseInt(questionIndex)] = {
      grade: gradingResult.grade,
      feedback: gradingResult.feedback,
      gradedAt: new Date(),
      gradedBy: 'AI',
    };

    result.markModified('writingGrades');
    await result.save();

    res.status(200).json({ 
      message: 'Writing answer auto-graded successfully',
      grade: gradingResult.grade,
      feedback: gradingResult.feedback,
    });
  } catch (error: any) {
    console.error('Error auto-grading writing answer:', error);
    res.status(500).json({ message: 'Error auto-grading writing answer', error: error.message });
  }
};

// Schedule auto-grading for a result (called after submission)
export const scheduleAutoGrading = async (resultId: string) => {
  try {
    console.log('Scheduling auto-grading for result:', resultId);
    const result = await TestResult.findById(resultId).populate('testId');
    if (!result) {
      console.error('Result not found for auto-grading:', resultId);
      return;
    }

    const test = result.testId as any;
    if (!test) {
      console.error('Test not found for result:', resultId);
      return;
    }

    // Check if the test has writing questions (including IELTS types)
    const writingQuestions = test.questions
      .map((q: any, i: number) => ({ ...q, index: i }))
      .filter((q: any) => q.type && (q.type === 'writing' || q.type.includes('ielts') || q.type.includes('task')));

    console.log('Found writing questions:', writingQuestions.length);
    console.log('Question types:', test.questions.map((q: any) => q.type));

    if (writingQuestions.length === 0) {
      console.log('No writing questions found, skipping auto-grading');
      return;
    }

    // Schedule grading for each writing question after 10 seconds
    writingQuestions.forEach((q: any) => {
      setTimeout(async () => {
        try {
          console.log(`Auto-grading question ${q.index} for result ${resultId}`);
          const answer = result.writingAnswers instanceof Map ? result.writingAnswers.get(q.index.toString()) : result.writingAnswers?.[q.index];
          if (!answer) {
            console.log(`No answer found for question ${q.index}`);
            return;
          }

          // Check if already graded
          if (result.writingGrades?.[q.index]) {
            console.log(`Question ${q.index} already graded, skipping`);
            return;
          }

          console.log('Calling AI to grade answer...');
          const gradingResult = await gradeWritingAnswer(q, answer);
          console.log('AI grading result:', gradingResult);

          // Save the grade
          const updatedResult = await TestResult.findById(resultId);
          if (!updatedResult) {
            console.error('Result not found when saving grade');
            return;
          }

          if (!updatedResult.writingGrades) {
            updatedResult.writingGrades = {};
          }

          (updatedResult.writingGrades as any)[q.index] = {
            grade: gradingResult.grade,
            feedback: gradingResult.feedback,
            gradedAt: new Date(),
            gradedBy: 'AI',
          };

          updatedResult.markModified('writingGrades');
          await updatedResult.save();

          console.log(`Successfully auto-graded question ${q.index} for result ${resultId}`);
        } catch (error) {
          console.error(`Error auto-grading question ${q.index}:`, error);
        }
      }, 10000); // 10 seconds delay
    });
  } catch (error) {
    console.error('Error scheduling auto-grading:', error);
  }
};

// Periodic checker for ungraded writing answers with smart sleep cycles
let isChecking = false;

export const startPeriodicGradingChecker = () => {
  if (isChecking) {
    console.log('Periodic grading checker already running');
    return;
  }

  isChecking = true;
  console.log('Starting periodic grading checker with smart sleep cycles...');

  let consecutiveEmptyChecks = 0;
  let checkCount = 0;
  let sleepDuration = 10000; // Start with 10 seconds

  const checkAndGrade = async () => {
    try {
      console.log(`Check #${checkCount + 1} - Checking for ungraded writing answers...`);
      
      // Find all results with writing answers that haven't been graded
      const results = await TestResult.find()
        .populate('testId')
        .sort({ createdAt: -1 });

      let foundUngraded = false;
      
      for (const result of results) {
        const test = result.testId as any;
        if (!test) continue;

        // If there are writing answers, grade them regardless of question type
        if (result.writingAnswers && result.writingAnswers instanceof Map && result.writingAnswers.size > 0) {
          for (const [index, answer] of result.writingAnswers.entries()) {
            const questionIndex = parseInt(index);
            const existingGrade = result.writingGrades?.[questionIndex];
            const question = test.questions?.[questionIndex];

            // If answer exists but not graded, grade it
            if (answer && !existingGrade) {
              foundUngraded = true;
              try {
                console.log(`Auto-grading question ${questionIndex} for result ${result._id}`);
                const gradingResult = await gradeWritingAnswer(question || { type: 'writing', question: 'Writing question' }, answer as string);
                
                const updatedResult = await TestResult.findById(result._id);
                if (!updatedResult) continue;

                if (!updatedResult.writingGrades) {
                  updatedResult.writingGrades = {};
                }

                (updatedResult.writingGrades as any)[questionIndex] = {
                  grade: gradingResult.grade,
                  feedback: gradingResult.feedback,
                  gradedAt: new Date(),
                  gradedBy: 'AI',
                };

                updatedResult.markModified('writingGrades');
                await updatedResult.save();

                console.log(`Successfully graded question ${questionIndex} with score ${gradingResult.grade}`);
              } catch (error) {
                console.error(`Error grading question ${questionIndex}:`, error);
              }
            }
          }
        }
      }

      checkCount++;

      // Smart sleep logic
      if (foundUngraded) {
        consecutiveEmptyChecks = 0;
        console.log('Found ungraded answers, continuing to check every 10 seconds');
        sleepDuration = 10000;
      } else {
        consecutiveEmptyChecks++;
        console.log(`No ungraded answers found. Consecutive empty checks: ${consecutiveEmptyChecks}/5`);

        if (consecutiveEmptyChecks >= 5) {
          console.log('5 consecutive empty checks, sleeping for 2 hours...');
          sleepDuration = 2 * 60 * 60 * 1000;
          consecutiveEmptyChecks = 0;
          checkCount = 0;
        } else {
          sleepDuration = 10000;
        }
      }

      setTimeout(checkAndGrade, sleepDuration);
      
    } catch (error) {
      console.error('Error in periodic grading checker:', error);
      setTimeout(checkAndGrade, 10000);
    }
  };

  // Start the checker
  checkAndGrade();
};
