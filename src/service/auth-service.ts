import { AppDataSource } from '@/config/data-source';
import jwt from 'jsonwebtoken';
import { User } from '@/entities/user';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '@/util';
import { UserRole } from '@/enum';
import { Request, Response } from 'express';
import { verifyRefreshToken } from '@/util/jwt';
import { saveDeviceService } from './device-service';

export const registerService = async (req: Request, res: Response) => {
  try {
    const { email, password, user_name, full_name } = req.body;
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOne({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return {
        status: 400,
        message: 'Email already exists',
      };
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const user = userRepo.create({
      full_name: full_name,
      email: email,
      password: hashPassword,
      user_name: user_name,
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

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    //call device service
    const device = await saveDeviceService(user.id, req);
    return {
      status: 201,
      message: 'Register success',
      data: {
        user,
        accessToken,
        refreshToken,
        device,
      },
    };
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /auth/login
export const loginService = async (req: Request, res: Response) => {
  const { email, password, user_name } = req.body;
  const userRepo = AppDataSource.getRepository(User);
  try {
    const existUser = await userRepo.findOne({
      where: {
        email,
        user_name,
      },
    });
    if (!existUser) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const accessToken = generateAccessToken({
      user_id: existUser.id.toString(),
      roles: existUser.roles as UserRole[],
      email: existUser.email,
      username: existUser.user_name,
    });
    const refreshToken = generateRefreshToken({
      user_id: existUser.id.toString(),
      roles: existUser.roles as UserRole[],
      email: existUser.email,
      username: existUser.user_name,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      status: 200,
      message: 'Login success',
      data: {
        user: existUser,
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /auth/refresh-token
export const refreshTokenHandler = async (req: Request, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token missing' });
  }

  try {
    // 1. Verify the refresh token
    const payload = verifyRefreshToken(refreshToken) as any;

    // 2. (Optional) Check if token is in database
    const user = await userRepo.findOneBy({ id: payload.user_id });

    if (!user) return res.status(401).json({ message: 'Invalid token' });

    // 3. Generate a new access toke
    // const newAccessToken = jwt.sign(
    //   { userId: user.id },
    //   process.env.ACCESS_TOKEN_SECRET as string,
    //   { expiresIn: '15m' },
    // );
    const accessToken = generateAccessToken({
      user_id: user.id.toString(),
      roles: user.roles as UserRole[],
      email: user.email,
      username: user.user_name,
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ accessToken: accessToken });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
};

export const logoutService = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
  return res.json({ message: 'Logged out successfully' });
};
