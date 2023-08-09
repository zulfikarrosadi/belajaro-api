import { Express, Request, Response } from 'express';
import {
  refreshTokenHandler,
  signInHandler,
  signOutHandler,
} from './controllers/authController';
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
import { validateRequest } from './middlewares/validateRequest';
import { verifyUserAuth } from './middlewares/verifyUserAuth';
import { createUserSchema, userSignInSchema } from './schemas/userSchemas';

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

  app.post('/posts', createThreadHandler);
  app.get('/posts', getThreadsHandler);
  app.get('/posts/:postID', getThreadByIdHandler);
  app.delete('/posts/:postID', deleteThreadHandler);
  app.put('/posts/:postID', updateThreadHandler);

  app.put('/users', updateUserHandler);
  app.delete('/auth/signout', signOutHandler);
}
