import { Forum } from '@prisma/client';
import { Request, Response, Express } from 'express';
import { defaultResponse } from '../global';
import { ForumData } from '../repositories/forumRepository';
import {
  createForumService,
  getForumByNameService,
  updateForumService,
} from '../services/forumService';

export async function createForumHandler(
  req: Request<{}, {}, ForumData>,
  res: Response<defaultResponse>,
) {
  const response = await createForumService({
    forumName: req.body.forumName,
    // @ts-ignore
    profilePicture: req.files?.profilePicture[0].filename,
    // @ts-ignore
    banner: req.files?.banner[0].filename,
    summary: req.body.summary,
    description: req.body.description,
    tags: req.body.tags,
  });
  return res.status(response.code!).json(response);
}
