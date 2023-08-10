import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/authService';

export type User = {
  email: string;
  id: number;
};

export async function deserializeUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const cookie = req.cookies;

  const { payload: accessTokenPayload } = verifyToken(cookie.accessToken);

  if (accessTokenPayload === null) {
    return next();
  }
  req.user = accessTokenPayload;
  res.locals.user = accessTokenPayload;

  return next();
}
