import { Router } from 'express';
import {
  studentLogin,
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
  changePassword,
} from '../controllers/authController';
import { protect } from '../middleware/protect';
import { rateLimit } from '../middleware/rateLimit';

const router = Router();

// POST /api/auth/student-login - Student login (rate limited)
router.post('/student-login', rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 5 }), studentLogin);

// POST /api/auth/request-password-reset - Request OTP for password reset (5 per day per email enforced in controller)
router.post('/request-password-reset', requestPasswordReset);

// POST /api/auth/verify-otp - Verify OTP (rate limited)
router.post('/verify-otp', rateLimit({ windowMs: 15 * 60 * 1000, maxRequests: 10 }), verifyResetToken);

// POST /api/auth/reset-password - Reset password with OTP (rate limited)
router.post('/reset-password', rateLimit({ windowMs: 60 * 60 * 1000, maxRequests: 3 }), resetPassword);

// POST /api/auth/change-password - Change password (authenticated)
router.post('/change-password', protect, changePassword);

export default router;
