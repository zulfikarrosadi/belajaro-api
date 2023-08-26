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
  userId: number,
  forumId:number
) {
  const newThread = await prisma.thread.create({
    data: {
      forum: {
        connect: {
          id: forumId,
          UserForum: {
            some: {
              forum_id: forumId,
              user_id: userId,
            },
          },
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      title: thread.title,
      content: thread.content,
      published: thread.published,
    },
    select: {
      id: true,
      title: true,
      content: true,
      created_at: true,
      forum: { select: { id: true, name: true } },
      user: { select: { id: true, profilePicture: true, firstname: true } },
    },
  });
  return newThread;
}

export async function updateThread(
  thread: Thread,
  author_id: number,
): Promise<Pick<Thread, 'id'> | any> {
  try {
    const threadId = await prisma.thread.update({
      where: {
        id: thread.id,
      },
      data: {
        title: thread.title,
        content: thread.content,
        updated_at: new Date().toISOString(),
        published: thread.published,
        user: { connect: { id: author_id } },
      },
    });
    return threadId;
  } catch (error) {
    return error;
  }
}

export async function deleteThread(
  threadId: number,
  author_id: number,
): Promise<{ threadId: number } | any> {
  try {
    const deletedThread = await prisma.thread.delete({
      where: { id: threadId, AND: { user: { id: author_id } } },
      select: { id: true },
    });
    return deletedThread.id;
  } catch (error) {
    return error;
  }
}
