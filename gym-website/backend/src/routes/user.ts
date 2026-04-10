import { Router } from 'express';
import { updateProfile, changePassword, deleteAccount } from '../controllers/userController';
import authenticateToken from '../middleware/auth';

const router = Router();

// All user routes require authentication
router.use(authenticateToken);

router.put('/profile', updateProfile);
router.put('/password', changePassword);
router.delete('/', deleteAccount);

export default router;
