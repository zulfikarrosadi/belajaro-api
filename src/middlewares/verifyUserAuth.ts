import { NextFunction, Request, Response } from 'express';
import { User } from './deserializeUser';

export async function verifyUserAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.sendStatus(401);
  }
  return next();
}
