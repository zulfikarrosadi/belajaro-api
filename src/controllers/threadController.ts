import { Request, Response } from 'express';
import { defaultResponse } from '../global';
import {
  createThreadService,
  deleteThreadService,
  getThreadByIdService,
  getThreadsService,
  updateThreadService,
} from '../services/threadService';
import { Thread } from '@prisma/client';

export async function getThreadsHandler(
  req: Request,
  res: Response<defaultResponse>,
) {
  const threads = await getThreadsService();
  return res.status(200).json(threads);
}

export async function getThreadByIdHandler(
  req: Request<{ threadId: string }>,
  res: Response<defaultResponse>,
) {
  const { threadId } = req.params;
  const id = parseInt(threadId, 10);
  const thread = await getThreadByIdService(id);
  return res.status(thread.code!).json(thread);
}

export async function createThreadHandler(
  req: Request<{ forumId: string }, {}, Thread>,
  res: Response<defaultResponse>,
) {
  const result = await createThreadService(
    req.body,
    parseInt(req.user.id, 10),
    parseInt(req.params.forumId, 10),
  );
  return res.status(result.code!).json(result);
}

export async function updateThreadHandler(
  req: Request<{}, {}, Thread>,
  res: Response<defaultResponse>,
) {
  const userId = req.user.id;
  const updatedThread = await updateThreadService(req.body, userId);
  return res.status(updatedThread.code!).json(updatedThread);
}

export async function deleteThreadHandler(
  req: Request<{ threadId: string }>,
  res: Response<defaultResponse>,
) {
  const { threadId } = req.params;
  const userId = req.user.id;
  const id = parseInt(threadId, 10);
  const deletedThread = await deleteThreadService(id, userId);
  return res.sendStatus(deletedThread);
}
