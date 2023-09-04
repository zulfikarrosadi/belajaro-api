import { Comment } from '@prisma/client';
import { defaultResponse } from '../global';
import {
  createComment,
  deleteComment,
  getCommentById,
} from '../repositories/commentRepository';

export async function createCommentService(
  data: Comment,
  threadId: number,
  userId: number,
): Promise<defaultResponse> {
  try {
    const comment = await createComment(data, threadId, userId);
    return { status: 'success', code: 201, data: comment };
  } catch (error) {
    return {
      status: 'fail',
      code: 400,
      error: { message: 'cannot create comment, please try again' },
    };
  }
}

export async function deleteCommentService(userId: number, commentId: number) {
  try {
    await deleteComment(userId, commentId);
    return 204;
  } catch (error) {
    return 404;
  }
}

export async function getCommentByIdService(
  commentId: number,
): Promise<defaultResponse> {
  const comment = await getCommentById(commentId);
  if (!comment) {
    return {
      status: 'fail',
      code: 404,
      error: { message: 'comment not found' },
    };
  }
  return { status: 'success', code: 200, data: comment };
}
