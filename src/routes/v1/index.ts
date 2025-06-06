/**
 *  @comyright 2025 dencodes
 * @license Apache-2.0
 */

/**
 * Node Modules
 */

import { Router } from 'express';
const router = Router();

/**
 * Root route
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the API',
    status: 'ok',
    version: '1.0.0',
    docs: 'https//docs.digital-idcard.com',
    timestamp: new Date().toISOString(),
  });
});

export default router;
