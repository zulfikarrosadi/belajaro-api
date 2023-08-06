import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

export type defaultResponse = {
  status: 'success' | 'fail';
  message?: string;
  data?: any;
  error?: {
    path?: string;
    value?: string;
    details?: string;
  };
};

export const privateKey = 'my private key';
export const publicKey = 'my public key';
export const cookieSecure =
  process.env.STATUS === 'PRODUCTION' || process.env.STATUS === 'TESTING';
