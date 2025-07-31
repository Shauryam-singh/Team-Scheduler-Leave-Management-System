import { Router } from 'express';
import { getLeaves, createLeave } from '../controllers/leaveController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/', getLeaves);
router.post('/', authMiddleware, createLeave);

export default router;
