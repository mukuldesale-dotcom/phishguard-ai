import { Router } from 'express';
import { body } from 'express-validator';
import { calculateTDEE, calculateBMI } from '../controllers/calculatorController';

const router = Router();

// Validation for TDEE calculation
const tdeeValidation = [
  body('age').isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  body('height').isFloat({ min: 50 }).withMessage('Height must be a positive number'),
  body('weight').isFloat({ min: 20 }).withMessage('Weight must be a positive number'),
  body('gender').isIn(['male', 'female']).withMessage('Gender must be male or female'),
  body('activityLevel').isIn(['sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active']).withMessage('Invalid activity level'),
  body('goal').isIn(['lose_weight', 'gain_muscle', 'maintenance']).withMessage('Invalid goal'),
];

router.post('/tdee', tdeeValidation, calculateTDEE);
router.post('/bmi', calculateBMI);

export default router;
