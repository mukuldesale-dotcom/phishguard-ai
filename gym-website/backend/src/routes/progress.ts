import { Router } from 'express';
import { body } from 'express-validator';
import { logProgress, getProgress, deleteProgress } from '../controllers/progressController';
import authenticateToken from '../middleware/auth';

const router = Router();

// All progress routes require authentication
router.use(authenticateToken);

router.post('/', [
  body('weight').isFloat({ min: 20, max: 500 }).withMessage('Weight must be between 20-500 kg'),
  body('date').optional().isISO8601().withMessage('Invalid date format'),
], logProgress);

router.get('/', getProgress);
router.delete('/:id', deleteProgress);

export default router;
