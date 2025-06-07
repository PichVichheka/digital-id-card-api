import { getUsersService } from '@/service/user-service';
import { Request, Response } from 'express';

export const getUsersController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { page, limit, sortBy, sortOrder, ...filters } = req.query;
  const result = await getUsersService({
    page: parseInt(page as string, 10) || 1,
    limit: parseInt(limit as string, 10) || 10,
    sortBy: sortBy as string,
    sortOrder: (sortOrder?.toString().toUpperCase() === 'ASC'
      ? 'ASC'
      : 'DESC') as 'ASC' | 'DESC',
    filters: filters as Record<string, string>,
  });
  res.status(201).json(result);
};
