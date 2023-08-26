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

export async function createForum(
  forumData: ForumData,
): Promise<{ id: number }> {
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
    select: { id: true },
  });
  return result;
}
