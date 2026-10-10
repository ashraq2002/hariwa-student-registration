import { Router } from 'express';
import {
  register,
  verifyOTP,
  verifyLink,
  resendOTP,
  login,
  getMe,
  resetPassword,
} from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { authRateLimiter, otpRateLimiter } from '../middleware/securityMiddleware.js';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/verify-otp', otpRateLimiter, verifyOTP);
router.post('/verify-link', otpRateLimiter, verifyLink);
router.get('/verify-link', otpRateLimiter, verifyLink);
router.post('/resend-otp', otpRateLimiter, resendOTP);
router.post('/login', authRateLimiter, login);
// router.post('/forgot-password', authRateLimiter, forgotPassword);
router.post('/reset-password', authRateLimiter, resetPassword);
router.get('/me', authenticateUser, getMe);

export default router;
