import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // const authHeader = req.headers.authorization;
  const authHeader = req.cookies?.accessToken;

  if (!authHeader) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }
};
