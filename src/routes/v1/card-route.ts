import { createCardController } from '@/controller/card-controller';
import { authMiddleware } from '@/middlware/auth-middleware';
import { Router } from 'express';

const router = Router();

router.post('/create-card', authMiddleware, createCardController);

export default router;
