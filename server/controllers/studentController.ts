import { Request, Response } from 'express';
import crypto from 'crypto';
import Student, { IStudent } from '../models/Student';
import { sendWelcomeEmail } from '../utils/emailService';

// Create a new student
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, phone, age, qualification, address, photoUrl, assignedClass, classTime, classes } = req.body;

    // Check if student with email already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      res.status(400).json({ message: 'Student with this email already exists' });
      return;
    }

    // Generate random password
    const password = crypto.randomBytes(8).toString('hex');

    const student: IStudent = new Student({
      fullName,
      email,
      phone,
      age,
      qualification,
      address,
      photoUrl,
      assignedClass,
      classTime,
      classes,
      password,
    });

    const savedStudent = await student.save();

    // Send welcome email with credentials
    await sendWelcomeEmail(email, password, fullName);

    res.status(201).json({
      ...savedStudent.toObject(),
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error });
  }
};

// Get all students
export const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students', error });
  }
};

// Get a single student by ID
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    res.status(200).json(student);
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Error fetching student', error });
  }
};

// Update a student
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, age, qualification, address, photoUrl, assignedClass, classTime, classes, isAdmitted, isPaid } = req.body;

    // Check if student exists
    const student = await Student.findById(id);
    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    // If email is being changed, check if new email already exists
    if (email && email !== student.email) {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        res.status(400).json({ message: 'Student with this email already exists' });
        return;
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        fullName: fullName || student.fullName,
        email: email || student.email,
        phone: phone || student.phone,
        age: age !== undefined ? age : student.age,
        qualification: qualification || student.qualification,
        address: address || student.address,
        photoUrl: photoUrl || student.photoUrl,
        assignedClass: assignedClass !== undefined ? assignedClass : student.assignedClass,
        classTime: classTime !== undefined ? classTime : student.classTime,
        classes: classes !== undefined ? classes : student.classes,
        isAdmitted: isAdmitted !== undefined ? isAdmitted : student.isAdmitted,
        isPaid: isPaid !== undefined ? isPaid : student.isPaid,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Error updating student', error });
  }
};

// Delete a student
export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndDelete(id);

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Error deleting student', error });
  }
};
