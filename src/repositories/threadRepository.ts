import { PrismaClient, Thread } from '@prisma/client';
import BadRequest from '../errors/badRequestError';
import NotFound from '../errors/notFoundError';

const prisma = new PrismaClient();

export async function getThreads() {
  const threads = await prisma.thread.findMany();
  return threads;
}

export async function getThreadById({ id }: { id: number }) {
  const thread = await prisma.thread.findFirst({
    where: { id },
  });
  return thread;
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
  const threadId = await prisma.thread.update({
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
  return threadId;
}

export async function deleteThread(threadId: number) {
  const deletedThread = await prisma.thread.delete({
    where: { id: threadId },
    select: { id: true },
  });
  return deletedThread.id;
}
