import { Request, Response } from 'express';
import Course from '../models/Course';

// Create a new course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, category, duration, price, image, description } = req.body;

    const course = await Course.create({
      title,
      category,
      duration,
      price,
      image,
      description
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
};

// Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

// Get a single course by ID
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

// Update a course
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { title, category, duration, price, image, description } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { title, category, duration, price, image, description },
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
};
