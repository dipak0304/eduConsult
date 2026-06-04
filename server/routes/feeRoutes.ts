import { Router } from 'express';
import {
  createFee,
  getAllFees,
  getFeeById,
  updateFee,
  deleteFee,
  getStudentFees,
} from '../controllers/feeController';

const router = Router();

// POST /api/fees - Create a new fee
router.post('/', createFee);

// GET /api/fees - Get all fees (with optional filters)
router.get('/', getAllFees);

// GET /api/fees/:id - Get fee by ID
router.get('/:id', getFeeById);

// PUT /api/fees/:id - Update fee
router.put('/:id', updateFee);

// DELETE /api/fees/:id - Delete fee
router.delete('/:id', deleteFee);

// GET /api/fees/student/:studentId - Get fees for a specific student
router.get('/student/:studentId', getStudentFees);

export default router;
