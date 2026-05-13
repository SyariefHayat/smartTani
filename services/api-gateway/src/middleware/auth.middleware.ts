import { Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../../../../shared/utils/jwt';
import { env } from '../config/env';
import { AppRequest, AppError } from '../../../../shared/types/express';

const PUBLIC_ENDPOINTS = [
  { method: 'POST', path: /^\/auth\/register$/ },
  { method: 'POST', path: /^\/auth\/login$/ },
  { method: 'POST', path: /^\/auth\/refresh$/ },
  { method: 'GET', path: /^\/products(\/.*)?$/ },
  { method: 'GET', path: /^\/categories(\/.*)?$/ },
  { method: 'GET', path: /^\/health$/ },
  { method: 'GET', path: /^\/api-docs(\/.*)?$/ },
];

export const gatewayAuthMiddleware = (req: AppRequest, res: Response, next: NextFunction) => {
  const { method, path } = req;

  // Check if current request is a public endpoint
  const isPublic = PUBLIC_ENDPOINTS.some((endpoint) => {
    return endpoint.method === method && endpoint.path.test(path);
  });

  if (isPublic) {
    return next();
  }

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

    // Attach user info to request object
    req.user = {
      id: payload.userId,
      ...payload,
    };

    // Note: We don't add headers here yet because we need to do it in the proxy middleware
    // to ensure they are sent to the downstream service.

    next();
  } catch (error) {
    next(error);
  }
};
