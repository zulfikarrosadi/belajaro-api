import { Request, Response } from 'express';
import { defaultResponse } from '../global';
import {
  createThreadService,
  deleteReplyThreadService,
  deleteThreadService,
  getThreadByIdService,
  getThreadsService,
  replyThreadService,
  updateThreadService,
  upvoteThreadService,
} from '../services/threadService';
import { Thread, ThreadReply } from '@prisma/client';

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
  req: Request<{ threadId: string }, {}, Thread>,
  res: Response<defaultResponse>,
) {
  const userId = parseInt(req.user.id, 10);
  const threadId = parseInt(req.params.threadId, 10);
  const updatedThread = await updateThreadService(req.body, userId, threadId);
  return res.status(updatedThread.code!).json(updatedThread);
}

export async function deleteThreadHandler(
  req: Request<{ threadId: string }>,
  res: Response<defaultResponse>,
) {
  const { threadId } = req.params;
  const userId = parseInt(req.user.id, 10);
  const id = parseInt(threadId, 10);
  const deletedThread = await deleteThreadService(id, userId);
  return res.sendStatus(deletedThread);
}

export async function upvoteThreadHandler(
  req: Request<{ threadId: string }>,
  res: Response,
) {
  const result = await upvoteThreadService(
    parseInt(req.params.threadId, 10),
    parseInt(req.user.id, 10),
  );
  return res.status(result.code!).json(result);
}

export async function replyThreadHandler(
  req: Request<{ threadParentId: string }, {}, ThreadReply>,
  res: Response,
) {
  const result = await replyThreadService(
    req.body,
    parseInt(req.params.threadParentId, 10),
    parseInt(req.user.id, 10),
  );

  return res.status(result.code!).json(result);
}

export async function deleteReplyThreadHandler(
  req: Request<{ threadReplyId: string }>,
  res: Response,
) {
  const result = await deleteReplyThreadService(
    parseInt(req.params.threadReplyId, 10),
    parseInt(req.user.id, 10),
  );

  return res.sendStatus(result);
}
