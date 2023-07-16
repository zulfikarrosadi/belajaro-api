import { meta, post } from '@prisma/client';
import { Request, Response } from 'express';
import BadRequest from '../errors/badRequestError';
import NotFound from '../errors/notFoundError';
import {
  getPosts,
  getPostByID,
  createPost,
  updatePost,
  deletePost,
} from '../repositories/postRepository';
import { defaultResponse } from '../global';

type postIDParam = { postID: string };
type createOrUpdatePost = { post: post; meta: meta };

export async function getPostsHandler(
  req: Request,
  res: Response<defaultResponse>,
) {
  let response: defaultResponse;
  try {
    const posts = await getPosts();
    response = { status: 'success', data: posts };

    return res.status(200).json(response);
  } catch (error: any) {
    response = { status: 'fail', error: { details: error.message } };
    return res.status(400).json(response);
  }
}

export async function getPostByIDHandler(
  req: Request<postIDParam>,
  res: Response<defaultResponse>,
) {
  const { postID } = req.params;
  const id = parseInt(postID, 10);
  try {
    const post = await getPostByID({ id });
    if (post instanceof NotFound) {
      throw Error(post.message);
    }
    const result: defaultResponse = { status: 'success', data: post };
    return res.status(200).json(result);
  } catch (error: any) {
    const result: defaultResponse = {
      status: 'fail',
      error: { details: error.message },
    };
    return res.status(404).json(result);
  }
}

export async function createPostHandler(
  req: Request<{}, {}, createOrUpdatePost>,
  res: Response<defaultResponse>,
) {
  let response: defaultResponse;
  try {
    const { id: postID } = await createPost(req.body.post, req.body.meta);
    response = { status: 'success', data: { postID } };

    return res.status(201).json(response);
  } catch (error: any) {
    console.log(error);

    response = { status: 'fail', error: { details: error.message } };
    return res.status(400).json(response);
  }
}

export async function updatePostHandler(
  req: Request<postIDParam, {}, createOrUpdatePost>,
  res: Response<defaultResponse>,
) {
  const { postID } = req.params;
  const id = parseInt(postID, 10);
  let response: defaultResponse;
  try {
    const updatedPost = await updatePost(req.body.post, req.body.meta);
    if (updatedPost instanceof BadRequest) {
      throw new Error(updatedPost.message);
    }
    response = { status: 'success', data: { postID: updatedPost.id } };
    return res.status(200).json(response);
  } catch (error: any) {
    response = { status: 'fail', error: { details: error.message } };
  }
}

export async function deletePostHandler(
  req: Request<postIDParam>,
  res: Response<defaultResponse>,
) {
  const { postID } = req.params;
  const id = parseInt(postID, 10);

  try {
    const deletedPost = await deletePost(id);
    if (deletedPost instanceof NotFound) {
      throw new Error(deletedPost.message);
    }
    return res.status(204);
  } catch (error: any) {
    return res
      .status(404)
      .json({ status: 'fail', error: { details: error.message } });
  }
}
