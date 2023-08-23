import { object, string, any, array } from 'zod';

export const createForumSchema = object({
  body: object({
    forumName: string({
      required_error: 'forum name is required',
    }).min(1, 'forum name should be minimum 1 character'),
    summary: string({
      required_error: 'forum summary is required',
    }),
    description: string().optional(),
    tags: array(string()).optional(),
    banner: any().optional(),
    profilePicture: any().optional(),
  }),
});

export const updateForumSchema = object({
  body: object({
    forumName: string({
      required_error: 'forum name is required',
    }).min(1, 'forum name should be minimum 1 character'),
    summary: string({
      required_error: 'forum summary is required',
    }),
    description: string().optional(),
    tags: array(string()).optional(),
    banner: any().optional(),
    profilePicture: any().optional(),
  }),
});
