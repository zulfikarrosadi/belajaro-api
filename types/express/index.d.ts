// declare global {}
declare namespace Express {
  interface Request {
    user: { email: string; id: string };
  }
}
