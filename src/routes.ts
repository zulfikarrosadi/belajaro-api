import { Express } from 'express';
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
import { validateRequest } from './middlewares/validateRequest';
import userSchemas from './schemas/userSchemas';

export default function routes(app: Express) {
  app.post('/posts', createPostHandler);
  app.get('/posts', getPostsHandler);
  app.get('/posts/:postID', getPostByIDHandler);
  app.delete('/posts/:postID', deletePostHandler);
  app.put('/posts/:postID', updatePostHandler);

  app.post('/users', validateRequest(userSchemas), createUserHandler);
  app.put('/users', updateUserHandler);
}
