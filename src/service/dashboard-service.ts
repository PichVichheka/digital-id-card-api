import { AppDataSource } from '@/config/data-source';
import { IdCard } from '@/entities/id-card';
import { User } from '@/entities/user';
import { Response, Request } from 'express';
import { Between, MoreThanOrEqual } from 'typeorm';
import { subDays, startOfDay, format } from 'date-fns';

export const getDashboardAnalyticsService = async (
  req: Request,
  res: Response,
) => {
  try {
    const userRepo = AppDataSource.getRepository(User);
    const cardRepo = AppDataSource.getRepository(IdCard);

    // Dates
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Analytics
    const [totalUsers, totalCards, todayUsers, activeUsers7Days] =
      await Promise.all([
        userRepo.count(),
        cardRepo.count(),
        userRepo.count({
          where: {
            created_at: Between(startOfToday, endOfToday),
          },
        }),
        userRepo.count({
          where: {
            created_at: MoreThanOrEqual(sevenDaysAgo),
          },
        }),
      ]);
    const summary = [
      {
        title: 'Total User',
        value: totalUsers,
        icon: 'Users',
      },
      {
        title: 'Total Cards',
        value: totalCards,
        icon: 'IdCard',
      },
      {
        title: 'Total Users Today',
        value: todayUsers,
        icon: 'UserSquare2',
      },
      {
        title: 'Active User in 7 days',
        value: activeUsers7Days,
        icon: 'LucideActivitySquare',
      },
    ];
    // --- Growth Chart (past 7 days) ---
    const usersLast7DaysRaw = await userRepo
      .createQueryBuilder('user')
      .select('DATE(user.created_at)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('user.created_at >= :sevenDaysAgo', { sevenDaysAgo })
      .groupBy('DATE(user.created_at)')
      .orderBy('DATE(user.created_at)', 'ASC')
      .getRawMany();

    // Normalize date to format: ['2024-06-14', 12]
    const usersLast7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = format(subDays(now, 6 - i), 'yyyy-MM-dd');
      const found = usersLast7DaysRaw.find((r) => r.date === date);
      return {
        date,
        count: parseInt(found?.count || '0', 10),
      };
    });
    return {
      message: 'Get all data successfully',
      summary,
      userGrowth: usersLast7Days,
    };
  } catch (error) {
    console.error('Dashboard Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
