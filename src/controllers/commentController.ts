import { Comment } from '@prisma/client';
import { Request, Response } from 'express';
import {
  createCommentService,
  deleteCommentService,
  getCommentByIdService,
} from '../services/commentService';

export async function createCommentHandler(
  req: Request<{ threadId: string }, {}, Comment>,
  res: Response,
) {
  const result = await createCommentService(
    req.body,
    parseInt(req.params.threadId, 10),
    parseInt(req.user.id),
  );

  return res.status(result.code!).json(result);
}
