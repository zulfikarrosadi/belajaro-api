import { PrismaClient, Thread } from '@prisma/client';
import BadRequest from '../errors/badRequestError';
import NotFound from '../errors/notFoundError';

const prisma = new PrismaClient();

export async function getThreads() {
  const posts = await prisma.thread.findMany();
  return posts;
}

export async function getThreadById({ id }: { id: number }) {
  try {
    const thread = await prisma.thread.findFirst({
      where: { id },
    });
    if (!thread) {
      throw new NotFound('post not found');
    }
    return thread;
  } catch (error) {
    return error;
  }
}

export async function createThread(
  thread: Thread,
): Promise<Pick<Thread, 'id'>> {
  const result = await prisma.thread.create({
    data: {
      title: thread.title,
      content: thread.content,
      published: thread.published,
      user: {
        connect: { id: thread.author_id },
      },
      forum: {
        connect: { id: thread.forum_id },
      },
      updated_at: new Date().toISOString(),
    },
    select: { id: true },
  });

  return { id: result.id };
}

export async function updateThread(
  thread: Thread,
): Promise<Pick<Thread, 'id'> | BadRequest> {
  try {
    const postID = await prisma.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        title: thread.title,
        content: thread.content,
        updated_at: new Date().toISOString(),
        published: thread.published,
      },
    });
    if (!postID) {
      throw new Error('bad request');
    }
    return postID;
  } catch (error: any) {
    const badRequestError = new BadRequest(error.message);
    return badRequestError;
  }
}

export async function deleteThread(threadId: number) {
  try {
    const deletedThread = await prisma.thread.delete({
      where: { id: threadId },
      select: { id: true },
    });
    if (!deletedThread) {
      throw new NotFound('post not found');
    }
    return deletedThread.id;
  } catch (error) {
    return error;
  }
}
