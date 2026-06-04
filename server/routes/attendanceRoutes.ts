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

const router = Router();

// POST /api/attendance - Create or update attendance record
router.post('/', createOrUpdateAttendance);

// GET /api/attendance - Get all attendance records (with optional filters)
router.get('/', getAllAttendance);

// GET /api/attendance/:id - Get attendance by ID
router.get('/:id', getAttendanceById);

// PUT /api/attendance/:id - Update attendance
router.put('/:id', updateAttendance);

// DELETE /api/attendance/:id - Delete attendance
router.delete('/:id', deleteAttendance);

// GET /api/attendance/student/:studentId - Get attendance for a specific student
router.get('/student/:studentId', getStudentAttendance);

// GET /api/attendance/date/:date - Get attendance for a specific date
router.get('/date/:date', getDateAttendance);

export default router;
