import { NextFunction, Request, Response } from 'express';
import { User } from './deserializeUser';

export async function verifyUserAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    return res.status(401).send('unauthorized');
  }
  return next();
}
