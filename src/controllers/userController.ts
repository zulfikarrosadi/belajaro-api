import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { createUserService, updateUserService } from '../services/userService';
import { cookieSecure, defaultResponse } from '../global';
import { createToken } from '../services/authService';

export async function createUserHandler(
  req: Request<{}, {}, User>,
  res: Response<defaultResponse>,
) {
  try {
    const user = await createUserService(req.body);
    if (user.status === 'fail') {
      throw user;
    }

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
  req: Request<{}, {}, User>,
  res: Response<defaultResponse>,
) {
  const response = await updateUserService({
    id: req.user.id,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    profilePicture: req.file?.filename ?? '',
  });
  return res.status(response.code!).json(response);
}
