import { Thread, ThreadReply } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import ErrorFactory from '../errors/errorFactory';
import { defaultResponse } from '../global';
import {
  createThread,
  deleteThread,
  getThreadById,
  getThreads,
  replyThread,
  updateThread,
  upvoteThread,
} from '../repositories/threadRepository';

export async function getThreadsService(): Promise<defaultResponse> {
  const threads = await getThreads();
  return { status: 'success', data: threads };
}

export async function getThreadByIdService(
  threadId: number,
): Promise<defaultResponse> {
  try {
    if (!threadId) {
      throw ErrorFactory.createNotFoundError('thread not found');
    }
    const thread = await getThreadById({ id: threadId });
    if (!thread) {
      throw ErrorFactory.createNotFoundError('thread not found');
    }
    return { status: 'success', code: 200, data: thread };
  } catch (error: any) {
    return { status: 'fail', code: 404, error };
  }
}

export async function createThreadService(
  thread: Thread,
  userId: number,
  forumId: number,
): Promise<defaultResponse> {
  try {
    const result = await createThread(thread, userId, forumId);
    return { status: 'success', code: 201, data: result };
  } catch (error: any) {
    return {
      status: 'fail',
      code: 400,
      error: { message: 'please join the forum before create any thread' },
    };
  }
}

export async function updateThreadService(
  thread: Thread,
  userId: number,
  threadId: number,
): Promise<defaultResponse> {
  const updatedThread = await updateThread(thread, userId, threadId);
  if (updatedThread instanceof PrismaClientValidationError) {
    return {
      status: 'fail',
      code: 400,
      error: { message: 'cannot update thread, please try again' },
    };
  }
  return { status: 'success', code: 200, data: updatedThread };
}

export async function deleteThreadService(
  threadId: number,
  userId: number,
): Promise<number> {
  if (!threadId) {
    return 400;
  }
  const deletedThread = await deleteThread(threadId, userId);
  if (deletedThread instanceof PrismaClientKnownRequestError) {
    return 400;
  }
  return deletedThread;
}

export async function upvoteThreadService(
  threadId: number,
  userId: number,
): Promise<defaultResponse> {
  try {
    const upvote = await upvoteThread(threadId, userId);
    return { status: 'success', code: 201, data: upvote };
  } catch (error) {
    return {
      status: 'fail',
      code: 400,
      error: { message: 'cannot upvote thread, please try again' },
    };
  }
}

export async function replyThreadService(
  threadReply: ThreadReply,
  threadParentId: number,
  userId: number,
): Promise<defaultResponse> {
  try {
    const result = await replyThread(threadReply, threadParentId, userId);
    return { status: 'success', code: 201, data: result };
  } catch (error) {
    return {
      status: 'fail',
      code: 400,
      error: { message: 'cannot reply this thread, please try again' },
    };
  }
}
