import { Router } from 'express';
import {
  getAllWritingResults,
  getWritingResultsByDate,
  gradeWritingAnswer,
  getResultById,
} from '../controllers/resultCheckingController';
import { protect } from '../middleware/protect';

const router = Router();

// Get all writing results
router.get('/', protect, getAllWritingResults);

// Get writing results by date
router.get('/date/:date', protect, getWritingResultsByDate);

// Get single result
router.get('/:id', protect, getResultById);

// Grade writing answer
router.post('/grade', protect, gradeWritingAnswer);

export default router;
