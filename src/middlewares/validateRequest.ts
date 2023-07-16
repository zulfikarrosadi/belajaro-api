import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { defaultResponse } from '../globalConstant';

export function validateRequest(schema: AnyZodObject) {
  return function (
    req: Request,
    res: Response<defaultResponse>,
    next: NextFunction,
  ) {
    try {
      schema.parse({ body: req.body });
      return next();
    } catch (error: any) {
      return res
        .status(400)
        .json({
          status: 'fail',
          message: 'validation error',
          error: error.issues,
        });
    }
  };
}
