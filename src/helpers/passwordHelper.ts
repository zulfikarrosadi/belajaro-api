import { compare, genSalt, hash } from 'bcrypt';

const defaultSaltRound = 10;

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt(defaultSaltRound);
  const hashedPassword = await hash(password, salt);
  return hashedPassword;
}

export function verifyPassword(
  password: string,
  hashedPassword: string,
): Promise<boolean> {
  const isVerified = compare(password, hashedPassword);
  if (!isVerified) {
    throw new Error('password is not match');
  }
  return isVerified;
}
