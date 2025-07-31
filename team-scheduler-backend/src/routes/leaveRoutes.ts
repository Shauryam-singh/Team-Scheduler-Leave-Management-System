import { Router } from 'express';
import { getLeaves, createLeave, updateLeaveStatus } from '../controllers/leaveController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', authMiddleware, getLeaves);
router.post('/', authMiddleware, createLeave);
router.patch('/:id/status', authMiddleware, updateLeaveStatus);

export default router;
