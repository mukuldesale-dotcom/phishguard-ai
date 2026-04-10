import { Router } from 'express';
import { getDietPlans, getDietById, getDietByGoal } from '../controllers/dietController';

const router = Router();

// Public routes for diet plans
router.get('/', getDietPlans);
router.get('/goal/:goal', getDietByGoal);
router.get('/:id', getDietById);

export default router;
