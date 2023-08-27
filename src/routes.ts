import { Express } from 'express';
import swaggerUIExpress from 'swagger-ui-express';

import {
  refreshTokenHandler,
  signInHandler,
  signOutHandler,
} from './controllers/authController';
import {
  createForumHandler,
  deleteForumHandler,
  getForumByNameHandler,
  joinForumHandler,
  leaveForumHandler,
  updateForumHandler,
} from './controllers/forumController';
import {
  getThreadsHandler,
  getThreadByIdHandler,
  deleteThreadHandler,
  updateThreadHandler,
  createThreadHandler,
  upvoteThreadHandler,
} from './controllers/threadController';
import {
  createUserHandler,
  updateUserHandler,
} from './controllers/userController';
import { deserializeUser } from './middlewares/deserializeUser';
import { formDataParser } from './middlewares/formDataParser';
import { validateRequest } from './middlewares/validateRequest';
import { verifyUserAuth } from './middlewares/verifyUserAuth';
import { createForumSchema, updateForumSchema } from './schemas/forumSchemas';
import {
  createUserSchema,
  updateUserSchema,
  userSignInSchema,
} from './schemas/userSchemas';
import swaggerDocs from '../swagger.json';
import uploadPhoto from './helpers/uploadPhoto';
import { FIELD_NAME } from './global';

export default function routes(app: Express) {
  app.get('/api/healthcheck', (req, res) => res.sendStatus(200));
  app.use(
    '/api/docs',
    swaggerUIExpress.serve,
    swaggerUIExpress.setup(swaggerDocs),
  );
  app.post(
    '/api/v1/auth/signup',
    validateRequest(createUserSchema),
    createUserHandler,
  );
  app.post(
    '/api/v1/auth/signin',
    validateRequest(userSignInSchema),
    signInHandler,
  );
  app.post('/api/v1/auth/refresh', refreshTokenHandler);

  app.use(deserializeUser);
  app.use(verifyUserAuth);

  app.post('/api/v1/forums/:forumId/threads', createThreadHandler);
  app.get('/api/v1/threads', getThreadsHandler);
  app.get('/api/v1/threads/:threadId', getThreadByIdHandler);
  app.delete('/api/v1/threads/:threadId', deleteThreadHandler);
  app.put('/api/v1/threads/:threadId', updateThreadHandler);
  app.post('/api/v1/threads/:threadId/upvote', upvoteThreadHandler);

  app.put(
    '/api/v1/users',
    formDataParser(uploadPhoto.single(FIELD_NAME.USER_PROFILE_PICTURE)),
    validateRequest(updateUserSchema),
    updateUserHandler,
  );
  app.delete('/api/v1/auth/signout', signOutHandler);

  app.post(
    '/api/v1/forums',
    formDataParser(
      uploadPhoto.fields([
        { name: FIELD_NAME.FORUM_PROFILE_PICTURE, maxCount: 1 },
        { name: FIELD_NAME.FORUM_BANNER, maxCount: 1 },
      ]),
    ),
    validateRequest(createForumSchema),
    createForumHandler,
  );
  app.get('/api/v1/forums/:forumName', getForumByNameHandler);
  app.put(
    '/api/v1/forums/:forumId',
    formDataParser(
      uploadPhoto.fields([
        { name: FIELD_NAME.FORUM_PROFILE_PICTURE, maxCount: 1 },
        { name: FIELD_NAME.FORUM_BANNER, maxCount: 1 },
      ]),
    ),
    validateRequest(updateForumSchema),
    updateForumHandler,
  );
  app.delete('/api/v1/forums/:forumId', deleteForumHandler);
  app.post('/api/v1/forums/:forumId/join', verifyUserAuth, joinForumHandler);
  app.delete(
    '/api/v1/forums/:forumId/leave',
    verifyUserAuth,
    leaveForumHandler,
  );
}
