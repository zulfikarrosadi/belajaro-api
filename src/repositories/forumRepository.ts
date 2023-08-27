import { PrismaClient, Forum } from '@prisma/client';

const prisma = new PrismaClient();

export type ForumData = {
  forumId?: number;
  forumName: string;
  summary: string;
  description: string;
  profilePicture?: string;
  banner?: string;
  tags: string[];
};

export async function createForum(forumData: ForumData): Promise<{
  id: number;
  name: string;
  summary: string;
  description: string | null;
  profilePicture: string | null;
  banner: string | null;
  forum_tags: { tags: { name: string; id: number } }[];
}> {
  const result = await prisma.forum.create({
    data: {
      name: forumData.forumName,
      summary: forumData.summary,
      description: forumData.description,
      profilePicture: forumData.profilePicture,
      banner: forumData.banner,
      forum_tags: {
        createMany: {
          data: forumData.tags.map((tag) => ({ tag_id: parseInt(tag) })),
        },
      },
    },
    select: {
      id: true,
      name: true,
      summary: true,
      description: true,
      profilePicture: true,
      banner: true,
      forum_tags: {
        select: { tags: { select: { name: true, id: true } } },
      },
    },
  });
  return result;
}

export async function updateForum(forumData: ForumData): Promise<{
  id: number;
  name: string;
  summary: string;
  description: string | null;
  profilePicture: string | null;
  banner: string | null;
  forum_tags: { tags: { name: string; id: number } }[];
}> {
  const result = await prisma.forum.update({
    where: { id: forumData.forumId },
    data: {
      name: forumData.forumName,
      description: forumData.description,
      profilePicture: forumData.profilePicture,
      banner: forumData.banner,
      summary: forumData.summary,
      forum_tags: {
        deleteMany: {},
        createMany: {
          data: forumData.tags.map((tag) => ({ tag_id: parseInt(tag) })),
        },
      },
    },
    select: {
      id: true,
      name: true,
      summary: true,
      description: true,
      profilePicture: true,
      banner: true,
      forum_tags: {
        select: { tags: { select: { name: true, id: true } } },
      },
    },
  });
  return result;
}

export async function getForumByName(
  name: string,
): Promise<Omit<Forum, 'banner' | 'summary'>[]> {
  const forums = await prisma.forum.findMany({
    where: { name: name },
    select: { id: true, name: true, description: true, profilePicture: true },
  });
  return forums;
}

export async function joinForum(userId: number, forumId: number) {
  const result = await prisma.userForum.create({
    data: {
      user: {
        connect: { id: userId },
      },
      forums: {
        connect: { id: forumId },
      },
      joinedAt: new Date().toISOString(),
    },
    select: {
      user_id: true,
      forum_id: true,
      joinedAt: true,
    },
  });
  return result;
}

export async function leaveForum(userId: number, forumId: number) {
  const result = await prisma.userForum.delete({
    where: {
      user_id_forum_id: {
        forum_id: forumId,
        user_id: userId,
      },
    },
  });
  return result;
}
