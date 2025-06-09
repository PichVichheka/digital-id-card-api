import {
  DeleteUserController,
  getUsersController,
  meController,
  updateUserController,
} from '@/controller';
import { UserRole } from '@/enum';
import { authMiddleware } from '@/middlware/auth-middleware';
import { roleCheck } from '@/middlware/role-middleware';
import { Router } from 'express';
const router = Router();

router.get(
  '/',
  authMiddleware,
  roleCheck([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  getUsersController,
);
router.get('/me', authMiddleware, meController);
router.put('/update-profile', authMiddleware, updateUserController);
router.delete(
  '/delete-user/:id',
  authMiddleware,
  roleCheck([UserRole.ADMIN, UserRole.SUPER_ADMIN]),
  DeleteUserController,
);

export default router;
