import { Request } from 'express';

export interface AppRequest extends Request {
  correlationId?: string;
  user?: {
    id: string;
    role?: string;
    full_name?: string;
    [key: string]: unknown;
  };
}

export interface AppError extends Error {
  status?: number;
  statusCode?: number;
  code?: string;
}
