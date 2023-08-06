import { users } from '@prisma/client';
import { Request, Response } from 'express';
import { createUserService } from '../services/userService';
import { cookieSecure, defaultResponse } from '../global';
import { createToken } from '../services/authService';

export async function createUserHandler(
  req: Request<{}, {}, users>,
  res: Response<defaultResponse>,
) {
  try {
    const user = await createUserService(req.body);

    const { accessToken, refreshToken } = createToken({
      email: user.data.email,
      id: user.data.id,
      newRefreshToken: true,
    });

    return res
      .status(201)
      .cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: cookieSecure,
      })
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: cookieSecure,
        path: '/auth/refresh',
      })
      .json(user);
  } catch (error: any) {
    return res.status(400).json(error);
  }
}

export async function updateUserHandler(
  req: Request<{}, {}, users>,
  res: Response<defaultResponse>,
) {}
