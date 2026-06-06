import mongoose, { Document, Schema } from 'mongoose';

export type QuestionType = 'mcq' | 'writing' | 'ielts-task-1' | 'ielts-task-2';

export interface IQuestion {
  type: QuestionType;
  question?: string;
  image?: string;
  options?: string[];
  correctAnswer?: number;
  wordLimit?: number;
}

export interface ITest extends Document {
  title: string;
  timeLimit: number;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  type: { type: String, enum: ['mcq', 'writing', 'ielts-task-1', 'ielts-task-2'], default: 'mcq' },
  question: { type: String, default: '' },
  image: { type: String, default: '' },
  options: { type: [String], default: [] },
  correctAnswer: { type: Number, default: 0 },
  wordLimit: { type: Number, default: 300 },
});

const TestSchema = new Schema<ITest>(
  {
    title: { type: String, required: true },
    timeLimit: { type: Number, required: true },
    questions: { type: [QuestionSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ITest>('Test', TestSchema);
