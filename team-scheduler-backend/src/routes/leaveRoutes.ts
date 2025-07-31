import { Router } from 'express';
import { getLeaves, createLeave } from '../controllers/leaveController';

const router = Router();

router.get('/', getLeaves);
router.post('/', createLeave);

export default router;
