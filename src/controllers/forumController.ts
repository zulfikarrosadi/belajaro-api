import { Request, Response } from 'express';
import { defaultResponse } from '../global';
import { ForumData } from '../repositories/forumRepository';
import {
  createForumService,
  getForumByNameService,
  joinForumService,
  leaveForumService,
  updateForumService,
} from '../services/forumService';

export async function createForumHandler(
  req: Request<{}, {}, ForumData>,
  res: Response<defaultResponse>,
) {
  const forumdata: ForumData = {
    forumName: req.body.forumName,
    summary: req.body.summary,
    description: req.body.description,
    tags: req.body.tags,
  };
  if (req.files?.forumBanner) {
    forumdata.banner = req.files?.forumBanner[0].filename;
  }
  if (req.files?.forumProfilePicture) {
    forumdata.profilePicture = req.files?.forumProfilePicture[0].filename;
  }
  const response = await createForumService(forumdata);
  return res.status(response.code!).json(response);
}

export async function updateForumHandler(
  req: Request<{ forumId: string }, {}, ForumData>,
  res: Response<defaultResponse>,
) {
  const forumdata: ForumData = {
    forumId: parseInt(req.params.forumId, 10),
    forumName: req.body.forumName,
    summary: req.body.summary,
    description: req.body.description,
    tags: req.body.tags,
  };
  if (req.files?.forumBanner) {
    forumdata.banner = req.files?.forumBanner[0].filename;
  }
  if (req.files?.forumProfilePicture) {
    forumdata.profilePicture = req.files?.forumProfilePicture[0].filename;
  }
  const response = await updateForumService(forumdata);
  return res.status(response.code!).json(response);
}
export async function getForumByNameHandler(
  req: Request<{ forumName: string }>,
  res: Response<defaultResponse>,
) {
  const response = await getForumByNameService(req.params.forumName);
  return res.status(response.code!).json(response);
}

export async function joinForumHandler(
  req: Request<{ forumId: string }>,
  res: Response,
) {
  const userId = parseInt(req.user.id, 10);
  const forumId = parseInt(req.params.forumId);
  const result = await joinForumService(userId, forumId);
  return res.status(result.code!).json(result);
}

export async function leaveForumHandler(
  req: Request<{ forumId: string }>,
  res: Response,
) {
  const userId = parseInt(req.user.id, 10);
  const forumId = parseInt(req.params.forumId);
  const result = await leaveForumService(userId, forumId);
  return res.status(result.code!).json(result);
}
