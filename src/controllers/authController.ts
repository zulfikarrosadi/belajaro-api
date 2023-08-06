import { users } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { cookieSecure, defaultResponse } from '../global';
import { createToken, verifyToken } from '../services/authService';

export async function signInHandler(
  req: Request<{}, {}, users>,
  res: Response<defaultResponse>,
) {}

export async function refreshTokenHandler(req: Request, res: Response) {
  const { refreshToken } = req.cookies;
  const { payload } = verifyToken(refreshToken);
  if (!payload) {
    return res.status(401).send('unauthorized');
  }
  const { accessToken: newAccessToken } = createToken({
    email: payload.email,
    id: payload.id,
  });

  return res
    .status(200)
    .cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: cookieSecure,
    })
    .send('token refreshed');
}
