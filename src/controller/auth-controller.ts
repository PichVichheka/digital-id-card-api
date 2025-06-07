import { register } from '@/service/auth-service';
import type { NextFunction, Request, Response } from 'express';

export const registerController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // const { email, password, user_name, full_name } = req.body;
  const result = await register(req, res);
  res.status(201).json(result);
};
