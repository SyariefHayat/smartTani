import { Response, NextFunction } from 'express';
import { AppRequest, AppError } from '../../../../shared/types/express';

/**
 * Middleware to trust headers from API Gateway
 */
export const gatewayAuthMiddleware = (req: AppRequest, res: Response, next: NextFunction) => {
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];

  if (!userId || !userRole) {
    const error = new Error('Unauthorized: Missing user context from gateway') as AppError;
    error.statusCode = 401;
    error.code = 'AUTH_009';
    return next(error);
  }

  req.user = {
    id: userId as string,
    role: userRole as string,
  };

  next();
};
