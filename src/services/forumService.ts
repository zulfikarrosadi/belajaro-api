import ErrorFactory from '../errors/errorFactory';
import { defaultResponse } from '../global';
import {
  createForum,
  ForumData,
  getForumByName,
  joinForum,
  leaveForum,
  updateForum,
} from '../repositories/forumRepository';

export async function createForumService(
  data: ForumData,
): Promise<defaultResponse> {
  try {
    const result = await createForum(data);
    if (!result) {
      throw ErrorFactory.createBadRequestError('cannot create forum', [
        { path: 'name', value: data.forumName },
        { path: 'description', value: data.description },
      ]);
    }

    const tags = result.forum_tags.map((data) => {
      return {
        id: data.tags.id,
        name: data.tags.name,
      };
    });
    return {
      status: 'success',
      code: 201,
      data: { ...result, forum_tags: tags },
    };
  } catch (error: any) {
    return {
      status: 'fail',
      code: 400,
      error: { message: error.message, details: error.details },
    };
  }
}

export async function updateForumService(
  forum: ForumData,
): Promise<defaultResponse> {
  try {
    const result = await updateForum(forum);
    if (!result) {
      throw ErrorFactory.createNotFoundError('forum is not found');
    }
    const tags = result.forum_tags.map((data) => {
      return {
        id: data.tags.id,
        name: data.tags.name,
      };
    });
    return {
      status: 'success',
      code: 200,
      data: { ...result, forum_tags: tags },
    };
  } catch (error: any) {
    return { status: 'fail', code: 404, error: { message: error.message } };
  }
}

export async function getForumByNameService(
  name: string,
): Promise<defaultResponse> {
  try {
    const forums = await getForumByName(name);
    if (!forums.length) {
      throw ErrorFactory.createNotFoundError('forum not found');
    }
    return { status: 'success', code: 200, data: forums };
  } catch (error: any) {
    return { status: 'fail', code: 404, error: { message: error.message } };
  }
}

export async function joinForumService(
  userId: number,
  forumId: number,
): Promise<defaultResponse> {
  try {
    const result = await joinForum(userId, forumId);

    return { status: 'success', code: 200, data: result };
  } catch (error) {
    return {
      status: 'fail',
      code: 400,
      error: { message: 'fail to join forum, please try again' },
    };
  }
}

export async function leaveForumService(
  userId: number,
  forumId: number,
): Promise<defaultResponse> {
  try {
    const result = await leaveForum(userId, forumId);

    return { status: 'success', code: 204 };
  } catch (error) {
    return {
      status: 'fail',
      code: 404,
      error: { message: 'fail to leave forum, please try again' },
    };
  }
}
