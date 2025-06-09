import { createCardService } from '@/service/card-service';
import { Request, Response } from 'express';

export const createCardController = async (req: Request, res: Response) => {
  const result = await createCardService(req, res);
  res.status(200).json(result);
};
