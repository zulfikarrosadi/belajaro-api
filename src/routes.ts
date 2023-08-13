import { Express, Request, Response } from 'express';
import {
  refreshTokenHandler,
  signInHandler,
  signOutHandler,
} from './controllers/authController';
import {
  createForumHandler,
  deleteForumHandler,
  getForumByNameHandler,
  updateForumHandler,
} from './controllers/forumController';
import {
  getThreadsHandler,
  getThreadByIdHandler,
  deleteThreadHandler,
  updateThreadHandler,
  createThreadHandler,
} from './controllers/threadController';
import {
  createUserHandler,
  updateUserHandler,
} from './controllers/userController';
import { deserializeUser } from './middlewares/deserializeUser';
import uploadPhoto from './middlewares/uploadPhoto';
import { validateRequest } from './middlewares/validateRequest';
import { verifyUserAuth } from './middlewares/verifyUserAuth';
import { createForumSchema } from './schemas/forumSchemas';
import {
  createUserSchema,
  updateUserSchema,
  userSignInSchema,
} from './schemas/userSchemas';

export default function routes(app: Express) {
  app.post(
    '/auth/signup',
    validateRequest(createUserSchema),
    createUserHandler,
  );
  app.post('/auth/signin', validateRequest(userSignInSchema), signInHandler);
  app.post('/auth/refresh', refreshTokenHandler);

  app.use(deserializeUser);
  app.use(verifyUserAuth);

  app.post('/threads', createThreadHandler);
  app.get('/threads', getThreadsHandler);
  app.get('/threads/:threadId', getThreadByIdHandler);
  app.delete('/threads/:threadId', deleteThreadHandler);
  app.put('/threads/:threadId', updateThreadHandler);

  app.put(
    '/users',
    uploadPhoto,
    validateRequest(updateUserSchema),
    updateUserHandler,
  );
  app.delete('/auth/signout', signOutHandler);

  app.post('/forums', validateRequest(createForumSchema), createForumHandler);
  app.get('/forums/:forumName', getForumByNameHandler);
  app.put(
    '/forums/:forumId',
    validateRequest(createForumSchema),
    updateForumHandler,
  );
  app.delete('/forums/:forumId', deleteForumHandler);
}
