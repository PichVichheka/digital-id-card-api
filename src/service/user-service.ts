import { AppDataSource } from '@/config/data-source';
import { User } from '@/entities/user';
import { paginate } from '@/util';
import { Request, Response } from 'express';

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

  return await AppDataSource.getRepository(User).findOneBy({ id: userId });
};

export const updateUserService = async (req: Request, res: Response) => {
  const userId = req.user?.user_id;
  const { full_name, email, user_name, avatar } = req.body;
  const users = await AppDataSource.getRepository(User).find();
  // const user = users.find((user) => user.id == userId);
  const userNameExist = users.find((user) => user.user_name == user_name);
  if (userNameExist && userNameExist.id !== userId) {
    res.status(409).json({
      message: 'Username already exists',
    });
  }
  await AppDataSource.getRepository(User).update(
    { id: userId },
    {
      full_name,
      email,
      user_name,
      avatar,
      updated_at: new Date(),
    },
  );
  const updatedUser = await AppDataSource.getRepository(User).findOneBy({
    id: userId,
  });

  return res.status(200).json({
    message: 'User updated successfully',
    user: updatedUser,
  });
};
