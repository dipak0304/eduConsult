import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db';
import { startPeriodicGradingChecker } from './controllers/aiGradingController';
import studentRoutes from './routes/studentRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import feeRoutes from './routes/feeRoutes';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import contactRoutes from './routes/contactRoutes';
import testRoutes from './routes/testRoutes';
import resultCheckingRoutes from './routes/resultCheckingRoutes';
import aiGradingRoutes from './routes/aiGradingRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/result-checking', resultCheckingRoutes);
app.use('/api/ai-grading', aiGradingRoutes);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'EduConsult Pro Server is running' });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      // Start periodic AI grading checker
      startPeriodicGradingChecker();
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
