import { Request, Response } from 'express';
import Fee, { IFee } from '../models/Fee';
import Student from '../models/Student';

// Create a new fee
export const createFee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, studentName, description, amount, dueDate, status } = req.body;

    const fee: IFee = new Fee({
      studentId,
      studentName,
      description,
      amount,
      dueDate,
      status: status || 'pending',
    });

    const savedFee = await fee.save();
    res.status(201).json(savedFee);
  } catch (error) {
    console.error('Error creating fee:', error);
    res.status(500).json({ message: 'Error creating fee', error });
  }
};

// Get all fees
export const getAllFees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, status } = req.query;

    let query: any = {};
    if (studentId) query.studentId = studentId;
    if (status) query.status = status;

    const fees = await Fee.find(query).sort({ createdAt: -1 });
    res.status(200).json(fees);
  } catch (error) {
    console.error('Error fetching fees:', error);
    res.status(500).json({ message: 'Error fetching fees', error });
  }
};

// Get fee by ID
export const getFeeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const fee = await Fee.findById(id);

    if (!fee) {
      res.status(404).json({ message: 'Fee not found' });
      return;
    }

    res.status(200).json(fee);
  } catch (error) {
    console.error('Error fetching fee:', error);
    res.status(500).json({ message: 'Error fetching fee', error });
  }
};

// Update fee
export const updateFee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { studentName, description, amount, dueDate, status } = req.body;

    const fee = await Fee.findById(id);
    if (!fee) {
      res.status(404).json({ message: 'Fee not found' });
      return;
    }

    const updatedFee = await Fee.findByIdAndUpdate(
      id,
      {
        studentName: studentName || fee.studentName,
        description: description || fee.description,
        amount: amount !== undefined ? amount : fee.amount,
        dueDate: dueDate || fee.dueDate,
        status: status !== undefined ? status : fee.status,
      },
      { new: true, runValidators: true }
    );

    // If fee status is changed to 'paid', automatically admit the student
    if (status === 'paid' && fee.status !== 'paid') {
      await Student.findByIdAndUpdate(
        fee.studentId,
        { isAdmitted: true, isPaid: true },
        { new: true, runValidators: true }
      );
    }

    res.status(200).json(updatedFee);
  } catch (error) {
    console.error('Error updating fee:', error);
    res.status(500).json({ message: 'Error updating fee', error });
  }
};

// Delete fee
export const deleteFee = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const fee = await Fee.findByIdAndDelete(id);

    if (!fee) {
      res.status(404).json({ message: 'Fee not found' });
      return;
    }

    res.status(200).json({ message: 'Fee deleted successfully' });
  } catch (error) {
    console.error('Error deleting fee:', error);
    res.status(500).json({ message: 'Error deleting fee', error });
  }
};

// Get fees for a specific student
export const getStudentFees = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const fees = await Fee.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json(fees);
  } catch (error) {
    console.error('Error fetching student fees:', error);
    res.status(500).json({ message: 'Error fetching student fees', error });
  }
};
