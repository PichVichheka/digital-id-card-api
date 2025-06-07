import { Router } from 'express';

/**
 * Controller
 */
import { registerController } from '@/controller/auth-controller';

const router = Router();

router.post('/register', registerController);

export default router;
