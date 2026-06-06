import { Request, Response } from 'express';
import Test from '../models/Test';
import TestResult from '../models/TestResult';

// Create a new test
export const createTest = async (req: Request, res: Response) => {
  try {
    const { title, timeLimit, questions } = req.body;

    const test = new Test({
      title,
      timeLimit,
      questions,
    });

    const savedTest = await test.save();
    res.status(201).json(savedTest);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating test', error: error.message });
  }
};

// Get all tests
export const getAllTests = async (req: Request, res: Response) => {
  try {
    const tests = await Test.find().sort({ createdAt: -1 });
    res.status(200).json(tests);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching tests', error: error.message });
  }
};

// Get a single test by ID
export const getTestById = async (req: Request, res: Response) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(200).json(test);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching test', error: error.message });
  }
};

// Update a test
export const updateTest = async (req: Request, res: Response) => {
  try {
    const { title, timeLimit, questions } = req.body;

    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { title, timeLimit, questions },
      { new: true, runValidators: true }
    );

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.status(200).json(test);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating test', error: error.message });
  }
};

// Delete a test
export const deleteTest = async (req: Request, res: Response) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // Delete all test results associated with this test
    await TestResult.deleteMany({ testId: req.params.id });

    res.status(200).json({ message: 'Test deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting test', error: error.message });
  }
};

// Submit a test result
export const submitTestResult = async (req: Request, res: Response) => {
  try {
    const { testId, studentId, answers, score, totalQuestions } = req.body;

    const testResult = new TestResult({
      testId,
      studentId,
      answers,
      score,
      totalQuestions,
    });

    const savedResult = await testResult.save();
    res.status(201).json(savedResult);
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting test result', error: error.message });
  }
};

// Get all test results for a student
export const getStudentTestResults = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const results = await TestResult.find({ studentId })
      .populate('testId')
      .sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching test results', error: error.message });
  }
};

// Get all test results for a test
export const getTestResults = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const results = await TestResult.find({ testId })
      .populate('studentId')
      .sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching test results', error: error.message });
  }
};

// Get all test results
export const getAllTestResults = async (req: Request, res: Response) => {
  try {
    const results = await TestResult.find()
      .populate('testId')
      .populate('studentId')
      .sort({ createdAt: -1 });
    res.status(200).json(results);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching test results', error: error.message });
  }
};
