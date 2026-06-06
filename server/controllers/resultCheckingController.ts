import { Request, Response } from 'express';
import TestResult from '../models/TestResult';
import Test from '../models/Test';
import Student from '../models/Student';

// Get all test results with writing answers
export const getAllWritingResults = async (req: Request, res: Response) => {
  try {
    const results = await TestResult.find()
      .populate('testId')
      .populate('studentId')
      .sort({ createdAt: -1 });
    
    // Filter results that have writing answers
    const writingResults = results.filter(result => {
      if (!result.testId) return false;
      const test = result.testId as any;
      return test.questions && test.questions.some((q: any) => q.type === 'writing');
    });

    res.status(200).json(writingResults);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching writing results', error: error.message });
  }
};

// Get writing results by date
export const getWritingResultsByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.params;
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const results = await TestResult.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate('testId')
      .populate('studentId')
      .sort({ createdAt: -1 });
    
    // Filter results that have writing answers
    const writingResults = results.filter(result => {
      if (!result.testId) return false;
      const test = result.testId as any;
      return test.questions && test.questions.some((q: any) => q.type === 'writing');
    });

    res.status(200).json(writingResults);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching writing results by date', error: error.message });
  }
};

// Update writing answer grade
export const gradeWritingAnswer = async (req: Request, res: Response) => {
  try {
    const { resultId, questionIndex, grade, feedback } = req.body;

    const result = await TestResult.findById(resultId);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    // Initialize writingGrades as a plain object if it doesn't exist
    if (!result.writingGrades) {
      result.writingGrades = {};
    }

    // Set the grade using plain object notation
    (result.writingGrades as any)[parseInt(questionIndex)] = {
      grade: parseFloat(grade),
      feedback: feedback || '',
      gradedAt: new Date(),
    };

    // Mark the field as modified since it's a Mixed type
    result.markModified('writingGrades');
    
    await result.save();

    res.status(200).json({ message: 'Writing answer graded successfully' });
  } catch (error: any) {
    console.error('Error grading writing answer:', error);
    res.status(500).json({ message: 'Error grading writing answer', error: error.message });
  }
};

// Get single result with details
export const getResultById = async (req: Request, res: Response) => {
  try {
    const result = await TestResult.findById(req.params.id)
      .populate('testId')
      .populate('studentId');

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching result', error: error.message });
  }
};
