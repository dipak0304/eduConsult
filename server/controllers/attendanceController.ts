import { Request, Response } from 'express';
import Attendance, { IAttendance } from '../models/Attendance';

// Create or update attendance record
export const createOrUpdateAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, date, status } = req.body;

    if (!studentId || !date || !status) {
      res.status(400).json({ message: 'studentId, date, and status are required' });
      return;
    }

    // Check if attendance record already exists for this student and date
    const existingAttendance = await Attendance.findOne({ studentId, date });

    if (existingAttendance) {
      // Update existing record
      const updatedAttendance = await Attendance.findOneAndUpdate(
        { studentId, date },
        { status },
        { new: true, runValidators: true }
      );
      res.status(200).json(updatedAttendance);
    } else {
      // Create new record
      const attendance: IAttendance = new Attendance({
        studentId,
        date,
        status,
      });
      const savedAttendance = await attendance.save();
      res.status(201).json(savedAttendance);
    }
  } catch (error) {
    console.error('Error creating/updating attendance:', error);
    res.status(500).json({ message: 'Error creating/updating attendance', error });
  }
};

// Get all attendance records
export const getAllAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, date } = req.query;

    let query: any = {};
    if (studentId) query.studentId = studentId;
    if (date) query.date = date;

    const attendance = await Attendance.find(query).sort({ date: -1 });
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
};

// Get attendance by ID
export const getAttendanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findById(id);

    if (!attendance) {
      res.status(404).json({ message: 'Attendance record not found' });
      return;
    }

    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Error fetching attendance', error });
  }
};

// Update attendance
export const updateAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const attendance = await Attendance.findById(id);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance record not found' });
      return;
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error('Error updating attendance:', error);
    res.status(500).json({ message: 'Error updating attendance', error });
  }
};

// Delete attendance
export const deleteAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      res.status(404).json({ message: 'Attendance record not found' });
      return;
    }

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    console.error('Error deleting attendance:', error);
    res.status(500).json({ message: 'Error deleting attendance', error });
  }
};

// Get attendance for a specific student
export const getStudentAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    let query: any = { studentId };

    if (startDate && endDate) {
      query.date = {
        $gte: startDate as string,
        $lte: endDate as string,
      };
    }

    const attendance = await Attendance.find(query).sort({ date: 1 });
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ message: 'Error fetching student attendance', error });
  }
};

// Get attendance for a specific date
export const getDateAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date } = req.params;
    const attendance = await Attendance.find({ date }).sort({ studentId: 1 });
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching date attendance:', error);
    res.status(500).json({ message: 'Error fetching date attendance', error });
  }
};
