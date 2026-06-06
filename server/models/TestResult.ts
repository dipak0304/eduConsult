import mongoose, { Document, Schema } from 'mongoose';

export interface ITestResult extends Document {
  testId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  answers: Record<number, number>;
  writingAnswers?: Record<number, string>;
  score: number;
  totalQuestions: number;
  createdAt: Date;
}

const TestResultSchema = new Schema<ITestResult>(
  {
    testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    answers: { type: Map, of: Number, default: {} },
    writingAnswers: { type: Map, of: String, default: {} },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITestResult>('TestResult', TestResultSchema);
