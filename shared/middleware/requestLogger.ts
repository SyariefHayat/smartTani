import { Request, Response, NextFunction } from 'express';
import { AppRequest } from '../types/express';

/**
 * Middleware to log incoming requests in a structured JSON format.
 */
export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      correlationId: (req as AppRequest).correlationId,
      userId: (req as AppRequest).user?.id || 'anonymous',
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    };

    console.log(JSON.stringify(logData));
  });

  next();
};
