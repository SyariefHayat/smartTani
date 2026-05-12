import { Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../../../../shared/utils/jwt';
import { env } from '../config/env';
import { AppRequest, AppError } from '../../../../shared/types/express';

export const authenticate = (req: AppRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Unauthorized: Missing token') as AppError;
      error.statusCode = 401;
      error.code = 'AUTH_009';
      throw error;
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken<TokenPayload>(token, env.JWT_SECRET);

    req.user = {
      id: payload.userId,
      ...payload,
    };
    next();
  } catch (error) {
    next(error);
  }
};
