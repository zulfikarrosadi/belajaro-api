import { PrismaClient, post, meta } from '@prisma/client';
import BadRequest from '../errors/badRequestError';
import NotFound from '../errors/notFoundError';

const prisma = new PrismaClient();

export async function getPosts() {
  try {
    const posts = await prisma.post.findMany();
    return posts;
  } catch (error) {
    return error;
  }
}

export async function getPostByID({ id }: { id: number }) {
  try {
    const post = await prisma.post.findFirst({
      where: { id },
    });
    if (!post) {
      throw new NotFound('post not found');
    }
    return post;
  } catch (error) {
    return error;
  }
}

export async function createPost(
  post: post,
  meta: meta,
): Promise<Pick<post, 'id'>> {
  const postID = await prisma.post.create({
    data: {
      title: post.title,
      content: post.content,
      published: post.published,
      user: {
        connect: {
          id: post.author_id,
        },
      },
      updated_at: new Date().toISOString(),
      meta_metaTopost: {
        create: {
          postBanner: meta.postBanner,
          description: meta.description,
          tag: meta.tag,
          categoryId: meta.categoryId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return { id: postID.id };
}

export async function updatePost(
  post: post,
  meta: meta,
): Promise<Pick<post, 'id'> | BadRequest> {
  try {
    const postID = await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        title: post.title,
        content: post.content,
        updated_at: new Date().toISOString(),
        published: post.published,
        meta_metaTopost: {
          update: {
            tag: meta.tag,
            description: meta.description,
            postBanner: meta.postBanner,
            categoryId: meta.categoryId,
          },
        },
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

export async function deletePost(postID: number) {
  try {
    const deletedPost = await prisma.post.delete({
      where: { id: postID },
      select: { id: true },
    });
    if (!deletedPost) {
      throw new NotFound('post not found');
    }
    return deletedPost.id;
  } catch (error) {
    return error;
  }
}
