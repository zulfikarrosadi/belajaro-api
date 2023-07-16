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
