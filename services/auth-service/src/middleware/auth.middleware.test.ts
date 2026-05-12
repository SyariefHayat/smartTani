import { Response, NextFunction } from 'express';
import { authenticate } from './auth.middleware';
import * as jwtUtils from '../../../../shared/utils/jwt';
import { AppRequest } from '../../../../shared/types/express';

jest.mock('../../../../shared/utils/jwt');

describe('Auth Middleware', () => {
  let mockRequest: Partial<AppRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() if token is valid', () => {
    mockRequest.headers!.authorization = 'Bearer valid-token';
    const mockPayload = { userId: 'user-123', role: 'petani', email: 'test@example.com' };

    // We use the mock from jest.setup.ts but we can override it here if needed
    (jwtUtils.verifyToken as jest.Mock).mockReturnValue(mockPayload);

    authenticate(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(jwtUtils.verifyToken).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(mockRequest.user).toEqual({
      id: mockPayload.userId,
      ...mockPayload,
    });
    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should call next with error if authorization header is missing', () => {
    authenticate(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: 'AUTH_009',
      })
    );
  });

  it('should call next with error if authorization header format is invalid', () => {
    mockRequest.headers!.authorization = 'InvalidFormat token';

    authenticate(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: 'AUTH_009',
      })
    );
  });

  it('should call next with error if token verification fails', () => {
    mockRequest.headers!.authorization = 'Bearer invalid-token';
    const mockError = new Error('Invalid token');
    (jwtUtils.verifyToken as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    authenticate(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(mockError);
  });
});
