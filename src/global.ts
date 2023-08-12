import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

export type defaultResponse = {
  status: 'success' | 'fail';
  code?: number;
  message?: string;
  data?: any;
  error?: {
    message: string;
    details?: {
      path: string;
      value?: any;
    }[];
  };
};

export const privateKey = 'my private key';
export const publicKey = 'my public key';
export const cookieSecure =
  process.env.STATUS === 'PRODUCTION' || process.env.STATUS === 'TESTING';
export const FIELD_NAME = {
  USER_PROFILE_PICTURE: 'userProfilePicture',
  FORUM_PROFILE_PICTURE: 'forumProfilePicture',
  FORUM_BANNER: 'forumBanner',
  THREADS: 'threads',
};
