import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { getProfile, updateProfile } from '../controllers/userController';

const router = express.Router();

router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);

export default router;