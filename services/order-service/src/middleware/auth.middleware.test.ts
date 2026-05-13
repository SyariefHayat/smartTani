import { Response, NextFunction } from 'express';
import { gatewayAuthMiddleware } from './auth.middleware';
import { AppRequest } from '../../../../shared/types/express';

describe('Gateway Auth Middleware (Order Service)', () => {
  let mockRequest: Partial<AppRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() if headers are present', () => {
    mockRequest.headers = {
      'x-user-id': 'u1',
      'x-user-role': 'buyer',
    };

    gatewayAuthMiddleware(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(mockRequest.user).toEqual({ id: 'u1', role: 'buyer' });
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should call next with error if headers are missing', () => {
    gatewayAuthMiddleware(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: 'AUTH_009',
      })
    );
  });
});
