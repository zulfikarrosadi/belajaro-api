import { Thread } from '@prisma/client';
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
): Promise<defaultResponse> {
  const result = await createThread(thread);
  return { status: 'success', code: 201, data: result };
}

export async function updateThreadService(
  thread: Thread,
): Promise<defaultResponse> {
  const updatedThread = await updateThread(thread);
  return { status: 'success', code: 200, data: updatedThread };
}

export async function deleteThreadService(threadId: number): Promise<number> {
  const deletedThread = await deleteThread(threadId);
  return deletedThread;
}
