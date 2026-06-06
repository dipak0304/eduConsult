import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AI_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

interface GradingResult {
  grade: number;
  feedback: string;
}

interface WritingQuestion {
  question: string;
  type: string;
  wordLimit?: number;
}

export const gradeWritingAnswer = async (
  question: WritingQuestion,
  answer: string
): Promise<GradingResult> => {
  try {
    let systemPrompt = '';
    let userPrompt = '';

    // Determine grading rubric based on question type
    if (question.type === 'ielts-task-1') {
      systemPrompt = `You are an IELTS examiner grading Writing Task 1. 
Grade the answer on a scale of 0-9 based on:
1. Task Achievement (TA): Did the candidate cover all requirements?
2. Coherence and Cohesion (CC): Is the answer well-organized?
3. Lexical Resource (LR): Vocabulary range and accuracy
4. Grammatical Range and Accuracy (GRA): Grammar variety and accuracy

IMPORTANT: The grade must be a whole number or .5 only (e.g., 6.0, 6.5, 7.0, 7.5). No other decimals.

Additionally, strictly analyze if the answer appears to be AI-generated. Look for:
- Unnatural phrasing patterns
- Overly perfect grammar without natural errors
- Generic or template-like responses
- Lack of personal voice or specific details
- Repetitive sentence structures

Estimate the percentage (0-100%) of AI-generated content. Be conservative in your estimate.

Provide a grade (0-9, in 0.5 increments only), detailed feedback on each criterion, and AI detection percentage.`;
      userPrompt = `Question: ${question.question}
Student's Answer: ${answer}

Please grade this IELTS Writing Task 1 answer and provide feedback.
Return your response in JSON format:
{
  "grade": <number from 0-9 in 0.5 increments only>,
  "feedback": "<detailed feedback>",
  "aiPercentage": <number from 0-100 representing estimated AI-generated content percentage>
}`;
    } else if (question.type === 'ielts-task-2') {
      systemPrompt = `You are an IELTS examiner grading Writing Task 2.
Grade the answer on a scale of 0-9 based on:
1. Task Response (TR): Did the candidate address all parts of the task?
2. Coherence and Cohesion (CC): Is the answer well-organized with clear paragraphs?
3. Lexical Resource (LR): Vocabulary range and accuracy
4. Grammatical Range and Accuracy (GRA): Grammar variety and accuracy

IMPORTANT: The grade must be a whole number or .5 only (e.g., 6.0, 6.5, 7.0, 7.5). No other decimals.

Additionally, strictly analyze if the answer appears to be AI-generated. Look for:
- Unnatural phrasing patterns
- Overly perfect grammar without natural errors
- Generic or template-like responses
- Lack of personal voice or specific details
- Repetitive sentence structures

Estimate the percentage (0-100%) of AI-generated content. Be conservative in your estimate.

Provide a grade (0-9, in 0.5 increments only), detailed feedback on each criterion, and AI detection percentage.`;
      userPrompt = `Question: ${question.question}
Student's Answer: ${answer}

Please grade this IELTS Writing Task 2 answer and provide feedback.
Return your response in JSON format:
{
  "grade": <number from 0-9 in 0.5 increments only>,
  "feedback": "<detailed feedback>",
  "aiPercentage": <number from 0-100 representing estimated AI-generated content percentage>
}`;
    } else {
      // General writing grading
      systemPrompt = `You are a writing instructor grading a student's writing assignment.
Grade the answer on a scale of 0-9 based on:
1. Content relevance and completeness
2. Organization and structure
3. Vocabulary and language use
4. Grammar and mechanics

IMPORTANT: The grade must be a whole number or .5 only (e.g., 6.0, 6.5, 7.0, 7.5). No other decimals.

Additionally, strictly analyze if the answer appears to be AI-generated. Look for:
- Unnatural phrasing patterns
- Overly perfect grammar without natural errors
- Generic or template-like responses
- Lack of personal voice or specific details
- Repetitive sentence structures

Estimate the percentage (0-100%) of AI-generated content. Be conservative in your estimate.

Provide a grade (0-9, in 0.5 increments only), constructive feedback, and AI detection percentage.`;
      userPrompt = `Question: ${question.question}
Student's Answer: ${answer}

Please grade this writing answer and provide feedback.
Return your response in JSON format:
{
  "grade": <number from 0-9 in 0.5 increments only>,
  "feedback": "<detailed feedback>",
  "aiPercentage": <number from 0-100 representing estimated AI-generated content percentage>
}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(response) as GradingResult & { aiPercentage?: number };
    
    // Round grade to nearest 0.5
    result.grade = Math.round(result.grade * 2) / 2;
    
    // Add AI warning to feedback if AI percentage is > 60%
    if (result.aiPercentage && result.aiPercentage > 60) {
      result.feedback = `⚠️ WARNING: This answer appears to be ${result.aiPercentage}% AI-generated. Please ensure the work is your own.\n\n${result.feedback}`;
    }
    
    return { grade: result.grade, feedback: result.feedback };
  } catch (error: any) {
    console.error('Error grading with AI:', error);
    throw new Error('AI grading failed: ' + error.message);
  }
};
