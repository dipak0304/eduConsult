import { Router } from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from '../controllers/courseController';
import { protect, authorize } from '../middleware/protect';

const router = Router();

// POST /api/courses - Create a new course (protected)
router.post('/', protect, authorize('teacher', 'admin'), createCourse);

// GET /api/courses - Get all courses (public)
router.get('/', getAllCourses);

// GET /api/courses/:id - Get a single course by ID (public)
router.get('/:id', getCourseById);

// PUT /api/courses/:id - Update a course (protected)
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);

// DELETE /api/courses/:id - Delete a course (protected)
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);

export default router;
