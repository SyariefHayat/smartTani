import { Response, NextFunction } from 'express';
import { AppRequest, AppError } from '../../../../shared/types/express';

/**
 * Middleware to authorize users based on their roles.
 * Must be used after the gatewayAuthMiddleware.
 */
export const authorize = (allowedRoles: string[]) => {
  return (req: AppRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        const error = new Error('Unauthorized: User not authenticated') as AppError;
        error.statusCode = 401;
        error.code = 'AUTH_009';
        throw error;
      }

      if (!allowedRoles.includes(req.user.role as string)) {
        const error = new Error(
          'Forbidden: You do not have permission to access this resource'
        ) as AppError;
        error.statusCode = 403;
        error.code = 'AUTH_011';
        throw error;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
