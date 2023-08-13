import { NextFunction, Request, Response } from 'express';
import { FIELD_NAME } from '../global';
import uploadPhoto from '../helpers/uploadPhoto';

export default async function (
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const upload = uploadPhoto.single(FIELD_NAME.USER_PROFILE_PICTURE);
  upload(req, res, async function (err) {
    if (err) {
      return res.status(400).json({ error: err, message: 'dari routes' });
    }
    return next();
  });
}
