import { Thread, ThreadReply } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import ErrorFactory from '../errors/errorFactory';
import { defaultResponse } from '../global';
import {
  createThread,
  deleteReplyThread,
  deleteThread,
  getJoinedForumThreads,
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

export async function deleteReplyThreadService(
  threadReplyId: number,
  userId: number,
) {
  try {
    await deleteReplyThread(threadReplyId, userId);
    return 204;
  } catch (error) {
    return 404;
  }
}

export async function getJoinedForumThreadsService(
  userId: number,
): Promise<defaultResponse> {
  const threads = await getJoinedForumThreads(userId);
  if(!threads.length) {
    return {status: 'success', code:200, data: []}
  }

  const mappedData = threads.map((data) => {
    return {
      forums: {
        id: data.forums.id,
        name: data.forums.name,
        profilePicture: data.forums.profilePicture,
        joinedAt: data.joinedAt,
        threads: data.forums.Thread.map((thread) => {
          return {
            id: thread.id,
            title: thread.title,
            content: thread.content,
            createdAt: thread.created_at,
            user: {
              id: thread.user.id,
              firstName: thread.user.firstname,
              profilePicture: thread.user.profilePicture,
            },
            count: {
              upvote: thread._count.Upvote,
              comment: thread._count.comment,
              threadReply: thread._count.ThreadReply,
            },
          };
        }),
      },
    };
  });
  return { status: 'success', code: 200, data: mappedData };
}
