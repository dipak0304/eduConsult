import { Router } from 'express';
import {
  createOrUpdateAttendance,
  getAllAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getStudentAttendance,
  getDateAttendance,
} from '../controllers/attendanceController';
import { protect, authorize } from '../middleware/protect';

const router = Router();

// POST /api/attendance - Create or update attendance record (protected)
router.post('/', protect, authorize('teacher', 'admin'), createOrUpdateAttendance);

// GET /api/attendance - Get all attendance records (protected)
router.get('/', protect, authorize('teacher', 'admin'), getAllAttendance);

// GET /api/attendance/:id - Get attendance by ID (protected)
router.get('/:id', protect, getAttendanceById);

// PUT /api/attendance/:id - Update attendance (protected)
router.put('/:id', protect, authorize('teacher', 'admin'), updateAttendance);

// DELETE /api/attendance/:id - Delete attendance (protected)
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteAttendance);

// GET /api/attendance/student/:studentId - Get attendance for a specific student (protected)
router.get('/student/:studentId', protect, getStudentAttendance);

// GET /api/attendance/date/:date - Get attendance for a specific date (protected)
router.get('/date/:date', protect, authorize('teacher', 'admin'), getDateAttendance);

export default router;
