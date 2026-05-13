import jwt from 'jsonwebtoken';
import { ErrorCode } from '../constants/errorCodes';

/**
 * Custom error class for unauthorized access
 */
export class UnauthorizedError extends Error {
  public code: string;
  public status: number;

  constructor(message = 'Unauthorized', code = ErrorCode.AUTH_TOKEN_INVALID) {
    super(message);
    this.name = 'UnauthorizedError';
    this.code = code;
    this.status = 401;
  }
}

export interface TokenPayload {
  userId: string;
  role: string;
  email: string;
  fullName?: string;
}

/**
 * Sign an Access Token (1 hour expiry)
 */
export const signAccessToken = (
  payload: TokenPayload,
  secret: string,
  expiresIn = '1h'
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Sign a Refresh Token (7 days expiry)
 */
export const signRefreshToken = (
  payload: { userId: string },
  secret: string,
  expiresIn = '7d'
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
  });
};

/**
 * Verify and decode a token
 */
export const verifyToken = <T>(token: string, secret: string): T => {
  try {
    return jwt.verify(token, secret) as T;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expired', ErrorCode.AUTH_TOKEN_EXPIRED);
    }
    throw new UnauthorizedError('Invalid token', ErrorCode.AUTH_TOKEN_INVALID);
  }
};
