import { NextFunction, Request, Response } from 'express';
import { defaultResponse } from '../global';

export function formDataParser(multer: any) {
  return function (
    req: Request,
    res: Response<defaultResponse>,
    next: NextFunction,
  ) {
    multer(req, res, async function (err: any) {
      if (err) {
        return res
          .status(400)
          .json({ status: 'fail', error: { message: err.message } });
      }
      return next();
    });
  };
}
