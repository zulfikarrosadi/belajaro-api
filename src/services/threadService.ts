import { Thread } from '@prisma/client';
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
  updateThread,
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
  } catch (error) {
    return { status: 'fail', code: 404, error };
  }
}

export async function createThreadService(
  thread: Thread,
  userId: number,
): Promise<defaultResponse> {
  const result = await createThread(thread, userId);
  return { status: 'success', code: 201, data: result };
}

export async function updateThreadService(
  thread: Thread,
  userId: number,
): Promise<defaultResponse> {
  const updatedThread = await updateThread(thread, userId);
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
