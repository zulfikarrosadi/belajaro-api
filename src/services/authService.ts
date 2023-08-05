import { randomBytes } from 'crypto';
import { sign, verify, JwtPayload } from 'jsonwebtoken';
import { privateKey } from '../global';

export type TokenPayload = Pick<JwtPayload, 'email' | 'id'>;

export function createToken({
  email,
  id,
  newRefreshToken = false,
}: {
  email: string;
  id: number;
  newRefreshToken?: boolean;
}): {
  accessToken: string;
  refreshToken?: string;
} {
  const accessToken = sign(
    { accessTokenID: randomBytes(32).toString('hex'), email, id },
    privateKey,
    {
      algorithm: 'HS256',
      expiresIn: 90000,
    },
  );
  if (!newRefreshToken) {
    return { accessToken };
  }
  const refreshToken = sign(
    { refreshTokenID: randomBytes(32).toString('hex'), email, id },
    privateKey,
    {
      algorithm: 'HS256',
      expiresIn: '15 days',
    },
  );

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): { payload: TokenPayload | null } {
  try {
    const decoded = verify(token, privateKey) as TokenPayload;
    return { payload: decoded };
  } catch (error) {
    return { payload: null };
  }
}
