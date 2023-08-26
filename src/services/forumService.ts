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
    return { status: 'success', code: 201, data: result };
  } catch (error: any) {
    console.log(error);

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
    return { status: 'success', code: 200, data: result };
  } catch (error: any) {
    return { status: 'fail', code: 404, error: { message: error.message } };
  }
}
