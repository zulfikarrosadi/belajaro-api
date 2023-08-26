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
