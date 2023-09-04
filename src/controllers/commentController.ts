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

export async function deleteCommentHandler(
  req: Request<{ commentId: string }>,
  res: Response,
) {
  const result = await deleteCommentService(
    parseInt(req.user.id, 10),
    parseInt(req.params.commentId, 10),
  );
  return res.sendStatus(result);
}

export async function getCommentByIdHandler(
  req: Request<{ commentId: string }>,
  res: Response,
) {
  const result = await getCommentByIdService(
    parseInt(req.params.commentId, 10),
  );
  return res.status(result.code!).json(result);
}
