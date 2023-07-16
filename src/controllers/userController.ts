import { users } from '@prisma/client';
import { Request, Response } from 'express';
import { createUserService } from '../services/userService';
import { defaultResponse } from '../global';

export async function createUserHandler(
  req: Request<{}, {}, users>,
  res: Response<defaultResponse>,
) {
  try {
    const user = await createUserService(req.body);
    console.log(user);
    // create session (auth service)
    return res.status(201).json(user);
  } catch (error: any) {
    return res.status(400).json(error);
  }
}

export async function updateUserHandler(
  req: Request<{}, {}, users>,
  res: Response<defaultResponse>,
) {}
