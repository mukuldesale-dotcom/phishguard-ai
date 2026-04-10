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

// Protected routes - must come before /:id to avoid route conflict
router.get('/user/saved', authenticateToken, getSavedWorkouts);

router.get('/:id', getWorkoutById);
router.post('/:id/save', authenticateToken, saveWorkout);

export default router;
