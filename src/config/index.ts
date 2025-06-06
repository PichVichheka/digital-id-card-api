/**
 *  @comyright 2025 dencodes
 * @license Apache-2.0
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  WHITELIST_ORIGINS: ['localhost:3000'],
};

export default config;
