import {
  createCardController,
  updateCardController,
} from '@/controller/card-controller';
import { authMiddleware } from '@/middleware/auth-middleware';
import { Router } from 'express';

const router = Router();

router.post('/create-card', authMiddleware, createCardController);
router.put('/update-card/:id', authMiddleware, updateCardController);

export default router;
