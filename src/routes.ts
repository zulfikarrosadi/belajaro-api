import { Express, Request, Response } from 'express';
import {
  refreshTokenHandler,
  signInHandler,
} from './controllers/authController';
import {
  getPostsHandler,
  getPostByIDHandler,
  deletePostHandler,
  updatePostHandler,
  createPostHandler,
} from './controllers/postController';
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

  app.post('/posts', createPostHandler);
  app.get('/posts', getPostsHandler);
  app.get('/posts/:postID', getPostByIDHandler);
  app.delete('/posts/:postID', deletePostHandler);
  app.put('/posts/:postID', updatePostHandler);

  app.put('/users', updateUserHandler);
}
