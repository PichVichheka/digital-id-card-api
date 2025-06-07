import { AppDataSource } from '@/config/data-source';
import { User } from '@/entities/user';
import { paginate } from '@/util';

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
