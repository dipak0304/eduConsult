import { Router } from 'express';
import {
  createFee,
  getAllFees,
  getFeeById,
  updateFee,
  deleteFee,
  getStudentFees,
} from '../controllers/feeController';
import { protect, authorize } from '../middleware/protect';

const router = Router();

// POST /api/fees - Create a new fee (protected)
router.post('/', protect, authorize('teacher', 'admin'), createFee);

// GET /api/fees - Get all fees (protected)
router.get('/', protect, authorize('teacher', 'admin'), getAllFees);

// GET /api/fees/:id - Get fee by ID (protected)
router.get('/:id', protect, getFeeById);

// PUT /api/fees/:id - Update fee (protected)
router.put('/:id', protect, authorize('teacher', 'admin'), updateFee);

// DELETE /api/fees/:id - Delete fee (protected)
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteFee);

// GET /api/fees/student/:studentId - Get fees for a specific student (protected)
router.get('/student/:studentId', protect, getStudentFees);

export default router;
