import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IStudent extends Document {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  qualification: string;
  address: string;
  photoUrl: string;
  assignedClass?: string;
  classTime?: string;
  classes?: Array<{ assignedClass: string; classTime: string }>;
  isAdmitted?: boolean;
  isPaid?: boolean;
  password: string;
  otp?: string;
  otpExpiry?: Date;
  otpRequestCount?: number;
  otpRequestDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const StudentSchema: Schema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    age: {
      type: Number,
      required: [true, 'Age is required'],
      min: [1, 'Age must be at least 1'],
    },
    qualification: {
      type: String,
      required: [true, 'Qualification is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    photoUrl: {
      type: String,
      required: [true, 'Photo URL is required'],
      trim: true,
    },
    assignedClass: {
      type: String,
      trim: true,
    },
    classTime: {
      type: String,
      trim: true,
    },
    classes: [{
      assignedClass: {
        type: String,
        trim: true,
      },
      classTime: {
        type: String,
        trim: true,
      },
    }],
    isAdmitted: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      select: false,
    },
    otp: {
      type: String,
      trim: true,
    },
    otpExpiry: {
      type: Date,
    },
    otpRequestCount: {
      type: Number,
      default: 0,
    },
    otpRequestDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
StudentSchema.pre('save', async function (next) {
  const student = this as any;
  
  // Only hash the password if it has been modified (or is new)
  if (!student.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(student.password, salt);
    student.password = hash;
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare password
StudentSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IStudent>('Student', StudentSchema);
