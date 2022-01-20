import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

import NotFoundError from '../error/notFoundError';

const prisma = new PrismaClient();

export default {
  getAllPost: async (req: Request, res: Response) => {
    try {
      let posts = (await prisma.post.findMany()) as any[];
      if (posts.length < 1) throw new NotFoundError('No post found');

      return res.status(200).json(posts);
    } catch (error: any) {
      return res.status(404).json({ message: error.message });
    }
  },

  getPostById: async (req: Request, res: Response) => {
    try {
      let { id } = req.params;
      const post = (await prisma.post.findUnique({
        where: { id: parseInt(id, 10) },
      })) as any;

      if (!post) throw new NotFoundError(`No post with ${id} found`);
      return res.status(200).json(post);
    } catch (error: any) {
      console.log(error);

      return res.status(404).json({ message: error.message });
    }
  },
};
