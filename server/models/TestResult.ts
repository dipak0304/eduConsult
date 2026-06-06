import mongoose, { Document, Schema } from 'mongoose';

export interface IWritingGrade {
  grade: number;
  feedback?: string;
  gradedAt: Date;
}

export interface ITestResult extends Document {
  testId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  answers: Record<number, number>;
  writingAnswers?: Record<number, string>;
  writingGrades?: Record<number, IWritingGrade>;
  score: number;
  totalQuestions: number;
  createdAt: Date;
}

const WritingGradeSchema = new Schema<IWritingGrade>({
  grade: { type: Number, required: true },
  feedback: { type: String, default: '' },
  gradedAt: { type: Date, default: Date.now },
});

const TestResultSchema = new Schema<ITestResult>(
  {
    testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    answers: { type: Map, of: Number, default: {} },
    writingAnswers: { type: Map, of: String, default: {} },
    writingGrades: { type: Schema.Types.Mixed, default: {} },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITestResult>('TestResult', TestResultSchema);
