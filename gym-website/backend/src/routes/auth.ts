import { Router } from 'express';
import { body } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { signup, login, refreshToken, logout, getMe } from '../controllers/authController';
import authenticateToken from '../middleware/auth';

const router = Router();

// Strict rate limiter for authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again in 15 minutes.' },
});

// Input validation rules for signup
const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase and number'),
  body('age').optional().isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('height').optional().isFloat({ min: 50, max: 300 }).withMessage('Height must be between 50-300 cm'),
  body('weight').optional().isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20-500 kg'),
];

// Validation rules for login
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Auth routes
router.post('/signup', authLimiter, signupValidation, signup);
router.post('/login', authLimiter, loginValidation, login);
router.post('/refresh', authLimiter, refreshToken);
router.post('/logout', authenticateToken, logout);
router.get('/me', authenticateToken, getMe);

export default router;
