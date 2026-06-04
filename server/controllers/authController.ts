import { Request, Response } from 'express';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Student from '../models/Student';
import { sendOTPEmail } from '../utils/emailService';

// Generate a 6-digit OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Student login
export const studentLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const student = await Student.findOne({ email }).select('+password');

    if (!student) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // For demo, we'll just check if password matches (in production, use bcrypt)
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: student._id.toString(),
        email: student.email,
        role: 'student'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Login successful',
      token,
      student: {
        id: student._id,
        fullName: student.fullName,
        email: student.email,
      }
    });
  } catch (error) {
    console.error('Error during student login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};

// Request password reset (send OTP)
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }

    const student = await Student.findOne({ email });

    if (!student) {
      res.status(404).json({ 
        message: 'No Student Found',
      });
      return;
    }

    // Check if user has exceeded daily OTP request limit (5 per day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (student.otpRequestDate && new Date(student.otpRequestDate) >= today) {
      if (student.otpRequestCount && student.otpRequestCount >= 5) {
        res.status(429).json({ 
          message: 'You have exceeded the maximum number of OTP requests for today. Please try again tomorrow.',
        });
        return;
      }
    } else {
      // Reset count if it's a new day
      student.otpRequestCount = 0;
      student.otpRequestDate = new Date();
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 600000); // 10 minutes from now

    student.otp = otp;
    student.otpExpiry = otpExpiry;
    student.otpRequestCount = (student.otpRequestCount || 0) + 1;
    student.otpRequestDate = new Date();
    await student.save();

    // Send OTP via email
    try {
      await sendOTPEmail(email, otp, student.fullName);
    } catch (emailError) {
      console.error('EmailJS error:', emailError);
      res.status(500).json({ 
        message: 'Failed to send OTP email. Please check your EmailJS configuration.',
        error: emailError instanceof Error ? emailError.message : 'Unknown error'
      });
      return;
    }

    res.status(200).json({ 
      message: 'OTP sent successfully to your email',
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Error requesting password reset', error });
  }
};

// Verify OTP
export const verifyResetToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      res.status(400).json({ message: 'OTP and email are required' });
      return;
    }

    const student = await Student.findOne({ 
      email,
      otp: otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!student) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    res.status(200).json({ message: 'OTP is valid' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Error verifying OTP', error });
  }
};

// Reset password with OTP
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({ message: 'Email, OTP, and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const student = await Student.findOne({ 
      email,
      otp: otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!student) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    student.password = newPassword;
    student.otp = undefined;
    student.otpExpiry = undefined;
    await student.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Error resetting password', error });
  }
};

// Teacher login
export const teacherLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const teacherEmail = process.env.TEACHER_EMAIL;
    const teacherPass = process.env.TEACHER_PASS;

    if (!teacherEmail || !teacherPass) {
      res.status(500).json({ message: 'Teacher credentials not configured' });
      return;
    }

    // Verify credentials
    if (email !== teacherEmail || password !== teacherPass) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: 'teacher',
        email: teacherEmail,
        role: 'teacher'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
      message: 'Login successful',
      token,
      teacher: {
        email: teacherEmail,
      }
    });
  } catch (error) {
    console.error('Error during teacher login:', error);
    res.status(500).json({ message: 'Error during login', error });
  }
};
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const student = await Student.findById(userId).select('+password');

    if (!student) {
      res.status(404).json({ message: 'Student not found' });
      return;
    }

    // For demo, we'll just check if current password matches (in production, use bcrypt)
    const isPasswordValid = await student.comparePassword(currentPassword);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    student.password = newPassword;
    await student.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error });
  }
};
