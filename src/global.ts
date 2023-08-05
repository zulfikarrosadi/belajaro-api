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
