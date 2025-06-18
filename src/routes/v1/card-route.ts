import {
  createCardController,
  deleteAdminCardController,
  deleteCardUserController,
  getCardsAdminController,
  getCardsUserController,
  updateCardController,
} from '@/controller/card-controller';
import { UserRole } from '@/enum';
import { authMiddleware } from '@/middleware/auth-middleware';
import { roleCheck } from '@/middleware/role-middleware';

import { Router } from 'express';

const router = Router();

router.post('/create-card', authMiddleware, createCardController);
router.put('/update-card/:id', authMiddleware, updateCardController);
router.delete('/delete-card/:id', authMiddleware, deleteCardUserController);
router.get('/get-cards', authMiddleware, getCardsUserController);

router.get(
  '/get-cards-by-admin',
  authMiddleware,
  roleCheck([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  getCardsAdminController,
);
router.delete(
  '/delete-card-by-admin/:id',
  authMiddleware,
  roleCheck([UserRole.SUPER_ADMIN, UserRole.ADMIN]),
  deleteAdminCardController,
);

export default router;
