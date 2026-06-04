import { Router } from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';
import { protect, authorize } from '../middleware/protect';

const router = Router();

// POST /api/students - Create a new student (protected)
router.post('/', protect, authorize('teacher', 'admin'), createStudent);

// GET /api/students - Get all students (protected)
router.get('/', protect, authorize('teacher', 'admin'), getAllStudents);

// GET /api/students/:id - Get a single student by ID (protected)
router.get('/:id', protect, getStudentById);

// PUT /api/students/:id - Update a student (protected)
router.put('/:id', protect, authorize('teacher', 'admin'), updateStudent);

// DELETE /api/students/:id - Delete a student (protected)
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteStudent);

export default router;
