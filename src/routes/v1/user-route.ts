import { getUsersController } from '@/controller';
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

export default router;
