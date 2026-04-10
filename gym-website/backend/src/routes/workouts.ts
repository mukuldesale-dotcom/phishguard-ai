import { Router } from 'express';
import {
  getWorkouts,
  getWorkoutById,
  getWeeklyPlan,
  saveWorkout,
  getSavedWorkouts,
} from '../controllers/workoutController';
import authenticateToken from '../middleware/auth';

const router = Router();

// Public routes - no authentication required
router.get('/', getWorkouts);
router.get('/weekly-plan', getWeeklyPlan);
router.get('/:id', getWorkoutById);

// Protected routes - require authentication
router.post('/:id/save', authenticateToken, saveWorkout);
router.get('/user/saved', authenticateToken, getSavedWorkouts);

export default router;
