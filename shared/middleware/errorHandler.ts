import { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import { errorResponse } from '../utils/response';
import { ErrorCode } from '../constants/errorCodes';
import { AppError, AppRequest } from '../types/express';

/**
 * Global Error Handler Middleware
 */
export const errorHandlerMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const correlationId = (req as AppRequest).correlationId;
  const status = err.status || err.statusCode || 500;
  const code = err.code || ErrorCode.INTERNAL_SERVER_ERROR;
  const message = err.message || 'Internal Server Error';

  // Log error to console with correlation ID
  console.error(`[Error][${correlationId}] ${message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Report to Sentry if in production/staging
  if (process.env.NODE_ENV !== 'development' && process.env.NODE_ENV !== 'test') {
    Sentry.withScope((scope) => {
      scope.setTag('correlation_id', correlationId);
      Sentry.captureException(err);
    });
  }

  // Send standardized error response
  res.status(status).json(errorResponse(code, message));
};
