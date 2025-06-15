import { createCardService, updateCardService } from '@/service/card-service';
import { Request, Response } from 'express';

export const createCardController = async (req: Request, res: Response) => {
  const result = await createCardService(req, res);
  res.status(201).json(result);
};

export const updateCardController = async (req: Request, res: Response) => {
  const result = await updateCardService(req, res);
  res.status(201).json(result);
};
