import { Router } from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controllers/studentController';

const router = Router();

// POST /api/students - Create a new student
router.post('/', createStudent);

// GET /api/students - Get all students
router.get('/', getAllStudents);

// GET /api/students/:id - Get a single student by ID
router.get('/:id', getStudentById);

// PUT /api/students/:id - Update a student
router.put('/:id', updateStudent);

// DELETE /api/students/:id - Delete a student
router.delete('/:id', deleteStudent);

export default router;
