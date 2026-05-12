import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AppRequest } from '../types/express';

/**
 * Middleware to generate or forward a Correlation ID for distributed tracing.
 */
export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const headerName = 'X-Correlation-ID';
  const correlationId = req.header(headerName) || uuidv4();

  // Set the correlation ID in the request object for downstream use
  (req as AppRequest).correlationId = correlationId;

  // Set the correlation ID in the response header
  res.setHeader(headerName, correlationId);

  next();
};
