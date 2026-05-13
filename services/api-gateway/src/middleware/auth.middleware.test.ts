import { Response, NextFunction } from 'express';
import { gatewayAuthMiddleware } from './auth.middleware';
import * as jwtUtils from '../../../../shared/utils/jwt';
import { AppRequest } from '../../../../shared/types/express';

jest.mock('../../../../shared/utils/jwt');

describe('Gateway Auth Middleware', () => {
  let mockRequest: Partial<AppRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
      method: 'GET',
    };
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should skip validation for public endpoints (GET /products)', () => {
    const req = { ...mockRequest, path: '/products', method: 'GET' } as AppRequest;

    gatewayAuthMiddleware(req, mockResponse as Response, nextFunction);

    expect(jwtUtils.verifyToken).not.toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should skip validation for public endpoints (POST /auth/login)', () => {
    const req = { ...mockRequest, path: '/auth/login', method: 'POST' } as AppRequest;

    gatewayAuthMiddleware(req, mockResponse as Response, nextFunction);

    expect(jwtUtils.verifyToken).not.toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should call next() if token is valid for protected routes', () => {
    const req = {
      ...mockRequest,
      path: '/auth/me',
      method: 'GET',
      headers: { authorization: 'Bearer valid-token' },
    } as unknown as AppRequest;
    const mockPayload = { userId: 'user-123', role: 'petani', email: 'test@example.com' };

    (jwtUtils.verifyToken as jest.Mock).mockReturnValue(mockPayload);

    gatewayAuthMiddleware(req, mockResponse as Response, nextFunction);

    expect(jwtUtils.verifyToken).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(req.user).toEqual({
      id: mockPayload.userId,
      ...mockPayload,
    });
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should call next with error if token is missing on protected route', () => {
    const req = { ...mockRequest, path: '/auth/me', method: 'GET' } as AppRequest;

    gatewayAuthMiddleware(req, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: 'AUTH_009',
      })
    );
  });

  it('should call next with error if token is invalid', () => {
    const req = {
      ...mockRequest,
      path: '/auth/me',
      method: 'GET',
      headers: { authorization: 'Bearer invalid-token' },
    } as unknown as AppRequest;
    const mockError = new Error('Invalid token');
    (jwtUtils.verifyToken as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    gatewayAuthMiddleware(req, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(mockError);
  });
});
