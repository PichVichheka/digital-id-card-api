import { AppDataSource } from '@/config/data-source';
import { RegisterDto } from '@/dto/request-dto/register-dto';
import { Device } from '@/entities/device';
import { User } from '@/entities/user';
import bcrypt from 'bcryptjs';
import { saveDevice } from './device-service';
import { parseDevice } from '@/util/device-parser';
import { generateAccessToken, generateRefreshToken } from '@/util';
import { UserRole } from '@/enum';

export const register = async (
  register: RegisterDto,
  req: Request,
  res: Response,
) => {
  const userRepo = AppDataSource.getRepository(User);
  const deviceRepo = AppDataSource.getRepository(Device);

  const existingUser = await userRepo.findOne({
    where: {
      email: register.email,
    },
  });
  if (existingUser) {
    return {
      status: 400,
      message: 'Email already exists',
    };
  }
  const hashPassword = await bcrypt.hash(register.password, 12);
  const user = userRepo.create({
    full_name: register.full_name,
    email: register.email,
    password: hashPassword,
  });
  await userRepo.save(user);
  const accessToken = generateAccessToken({
    user_id: user.id.toString(),
    roles: user.roles as UserRole[],
    email: user.email,
    username: user.user_name,
  });
  const refreshToken = generateRefreshToken({
    user_id: user.id.toString(),
    roles: user.roles as UserRole[],
    email: user.email,
    username: user.user_name,
  });

  // @ts-ignore
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const deviceInfo = parseDevice(req as any);
  const device = await saveDevice(user.id.toString(), deviceInfo);

  return {
    status: 200,
    message: 'Register success',
    data: {
      user,
      accessToken,
      refreshToken,
      device,
    },
  };
};

// export const refreshToken = async (req: Request, res: Response) => {
//   const token = req.cookies.refreshToken;
//   if (!token) return res.status(401).json({ message: 'No token provided' });

//   try {
//     const payload = await UserService.verifyRefreshToken(token);
//     const accessToken = generateAccessToken({ userId: payload.userId });
//     res.json({ accessToken });
//   } catch {
//     res.status(403).json({ message: 'Invalid or expired refresh token' });
//   }
// };

// export const logout = async (req: Request, res: Response) => {
//   res.clearCookie('refreshToken');
//   res.json({ message: 'Logged out successfully' });
// };
