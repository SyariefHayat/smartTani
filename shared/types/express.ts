import { Request } from 'express';

export interface AppRequest extends Request {
  correlationId?: string;
  user?: {
    id: string;
    [key: string]: unknown;
  };
}

export interface AppError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
}
