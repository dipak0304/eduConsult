import express from 'express';
import { autoGradeWritingAnswer } from '../controllers/aiGradingController';
import { protect } from '../middleware/protect';

const router = express.Router();

// Auto-grade a writing answer (protected route)
router.post('/auto-grade', protect, autoGradeWritingAnswer);

export default router;
