import { users } from '@prisma/client';
import { Request, Response } from 'express';
import ErrorFactory from '../errors/errorFactory';
import { cookieSecure, defaultResponse } from '../global';
import {
  createToken,
  signInService,
  verifyToken,
} from '../services/authService';

export async function signInHandler(
  req: Request<{}, {}, Pick<users, 'email' | 'password'>>,
  res: Response<defaultResponse>,
) {
  const { email, password } = req.body;
  try {
    const response = await signInService({ email, password });

    if (!response) {
      throw ErrorFactory.createBadRequestError(
        'email or password is incorrect',
        [
          { path: 'email', value: email },
          { path: 'password', value: password },
        ],
      );
    }

    return res
      .status(200)
      .cookie('accessToken', response.accessToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: 'none',
      })
      .cookie('refreshToken', response.refreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: 'none',
        path: '/auth/refresh',
      })
      .json({ status: 'success', data: { email, id: response.userId } });
  } catch (error) {
    console.log(error);

    return res.status(400).json({ status: 'fail', error });
  }
}

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
    .cookie('accessToken', newAccessToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: cookieSecure,
    })
    .sendStatus(200);
}

export async function signOutHandler(req: Request, res: Response) {
  return res
    .cookie('accessToken', '', {
      maxAge: 0,
      secure: cookieSecure,
      sameSite: 'none',
    })
    .cookie('refreshToken', '', {
      maxAge: 0,
      secure: cookieSecure,
      sameSite: 'none',
      path: '/auth/refresh',
    })
    .sendStatus(204);
}
