import { AnyZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { defaultResponse } from '../global';

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
      return res.status(400).json({
        status: 'fail',
        error: {
          message: 'validation error',
          details: mapZodError(error),
        },
      });
    }
  };
}

function mapZodError(error: ZodError) {
  return error.issues.map((issue) => {
    return {
      path: issue.path,
      message: issue.message,
    };
  });
}
