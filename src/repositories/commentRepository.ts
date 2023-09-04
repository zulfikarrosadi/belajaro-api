import { Comment, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createComment(
  data: Comment,
  threadId: number,
  userId: number,
) {
  const comment = await prisma.comment.create({
    data: {
      content: data.content,
      post: {
        connect: {
          id: threadId,
        },
      },
      user: {
        connect: {
          id: userId,
        },
      },
      createdAt: new Date().toISOString(),
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      threadId: true,
      user: { select: { firstname: true, id: true, profilePicture: true } },
    },
  });

  return comment;
}

export async function deleteComment(userId: number, commentId: number) {
  const comment = await prisma.comment.delete({
    where: {
      id: commentId,
      AND: { user_id: userId },
    },
    select: { id: true },
  });
}

export async function getCommentById(commentId: number) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      user: { select: { id: true, firstname: true, profilePicture: true } },
    },
  });

  return comment;
}
