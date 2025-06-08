import { AppDataSource } from '@/config/data-source';
import { User } from '@/entities/user';
import { paginate } from '@/util';
import { Request } from 'express';

export const getUsersService = async ({
  page,
  limit,
  sortBy,
  sortOrder,
  filters,
}: {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
  filters: Record<string, string>;
}) => {
  const userRepo = AppDataSource.getRepository(User);

  return await paginate(userRepo, {
    page,
    limit,
    sortBy,
    sortOrder,
    filters,
  });
};

export const meService = async (req: Request) => {
  const userId = req.user?.user_id;
  console.log(userId);
  return await AppDataSource.getRepository(User).findOneBy({ id: userId });
};
