import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  studentId: string;
  date: string;
  status: 'present' | 'absent' | 'tardy';
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: ['present', 'absent', 'tardy'],
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index for studentId and date to ensure uniqueness
AttendanceSchema.index({ studentId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
