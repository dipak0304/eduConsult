import mongoose, { Document, Schema } from 'mongoose';

export interface IFee extends Document {
  studentId: string;
  studentName: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema: Schema = new Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
    },
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    dueDate: {
      type: String,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['paid', 'pending'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFee>('Fee', FeeSchema);
