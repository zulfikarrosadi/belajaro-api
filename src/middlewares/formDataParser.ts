import { NextFunction, Request, Response } from 'express';

export function formDataParser(multer: any) {
  return function (req: Request, res: Response, next: NextFunction) {
    multer(req, res, async function (err: any) {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: err, message: 'dari routes' });
      }
      return next();
    });
  };
}
