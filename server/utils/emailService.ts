import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send OTP email
export const sendOTPEmail = async (email: string, otp: string, name: string): Promise<void> => {
  console.log('Email Configuration Check:');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
  console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
  console.log('- EMAIL_SERVICE:', process.env.EMAIL_SERVICE || 'NOT SET');

  if (!process.env.EMAIL_USER) {
    throw new Error('EMAIL_USER is not configured in environment variables');
  }
  if (!process.env.EMAIL_PASS) {
    throw new Error('EMAIL_PASS is not configured in environment variables');
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - EduConsult Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">EduConsult Pro</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Password Reset OTP</h2>
            <p style="color: #6b7280;">Hello ${name},</p>
            <p style="color: #6b7280;">You have requested to reset your password. Use the following OTP to proceed:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; border: 2px solid #3b82f6;">
              <span style="font-size: 32px; font-weight: bold; color: #1e3a8a; letter-spacing: 5px;">${otp}</span>
            </div>
            <p style="color: #6b7280;">This OTP will expire in 10 minutes.</p>
            <p style="color: #6b7280;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>&copy; 2024 EduConsult Pro. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    console.log('Sending OTP email to:', email);
    const response = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', response.messageId);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw error;
  }
};

// Send welcome email with credentials
export const sendWelcomeEmail = async (email: string, password: string, name: string): Promise<void> => {
  if (!process.env.EMAIL_USER) {
    throw new Error('EMAIL_USER is not configured in environment variables');
  }
  if (!process.env.EMAIL_PASS) {
    throw new Error('EMAIL_PASS is not configured in environment variables');
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to EduConsult Pro - Your Account Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0;">EduConsult Pro</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #1f2937; margin-top: 0;">Welcome to EduConsult Pro!</h2>
            <p style="color: #6b7280;">Hello ${name},</p>
            <p style="color: #6b7280;">Your account has been created successfully. Here are your login credentials:</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #1f2937; margin: 10px 0;"><strong>Email:</strong> ${email}</p>
              <p style="color: #1f2937; margin: 10px 0;"><strong>Password:</strong> <span style="font-family: monospace; background: #f3f4f6; padding: 5px 10px; border-radius: 4px;">${password}</span></p>
            </div>
            <p style="color: #6b7280;">Please login and change your password for security.</p>
            <p style="color: #6b7280;">If you forget your password, you can use the "Forgot Password" option on the login page.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>&copy; 2024 EduConsult Pro. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};
