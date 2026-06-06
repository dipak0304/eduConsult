import { Router, Request, Response } from 'express';
import {
  createTest,
  getAllTests,
  getTestById,
  updateTest,
  deleteTest,
  submitTestResult,
  getStudentTestResults,
  getTestResults,
  getAllTestResults,
} from '../controllers/testController';
import { protect } from '../middleware/protect';

const router = Router();

// Test routes
router.post('/', protect, createTest); // Create test (protected)
router.get('/', getAllTests); // Get all tests (public)

// Test result routes (must come before /:id to avoid conflicts)
router.post('/results', submitTestResult); // Submit test result (public)
router.get('/results/student/:studentId', getStudentTestResults); // Get student's test results (public)
router.get('/results/test/:testId', getTestResults); // Get test's results (public)
router.get('/results/all', getAllTestResults); // Get all test results (public)

router.get('/:id', getTestById); // Get test by ID (public)
router.put('/:id', protect, updateTest); // Update test (protected)
router.delete('/:id', protect, deleteTest); // Delete test (protected)

export default router;
