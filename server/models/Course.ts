import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  category: string;
  duration: string;
  price: string;
  image: string;
  description?: string;
}

const CourseSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Course category is required'],
    trim: true
  },
  duration: {
    type: String,
    required: [true, 'Course duration is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Course price is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Course image is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
CourseSchema.index({ createdAt: -1 });
CourseSchema.index({ category: 1 });
CourseSchema.index({ title: 'text', category: 'text' });

export default mongoose.model<ICourse>('Course', CourseSchema);
