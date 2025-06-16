import {
  createCardService,
  deleteCardUserService,
  getCardsForUserService,
  updateCardService,
} from '@/service/card-service';
import { Request, Response } from 'express';

export const createCardController = async (req: Request, res: Response) => {
  const result = await createCardService(req, res);
  res.status(201).json(result);
};

export const updateCardController = async (req: Request, res: Response) => {
  const result = await updateCardService(req, res);
  res.status(201).json(result);
};

export const deleteCardUserController = async (req: Request, res: Response) => {
  const result = await deleteCardUserService(req, res);
  res.status(201).json(result);
};

export const getCardsUserController = async (req: Request, res: Response) => {
  const result = await getCardsForUserService(req, res);
  res.status(201).json(result);
};
