import { Response, NextFunction } from 'express';
import { authorize } from './authorize.middleware';
import { AppRequest } from '../../../../shared/types/express';

describe('Authorize Middleware (Order Service)', () => {
  let mockRequest: Partial<AppRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {};
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() if user role is allowed', () => {
    mockRequest.user = { id: '1', role: 'admin', email: 'admin@test.com' };
    const middleware = authorize(['admin', 'buyer']);

    middleware(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith();
  });

  it('should call next with error if user role is not allowed', () => {
    mockRequest.user = { id: '1', role: 'petani', email: 'petani@test.com' };
    const middleware = authorize(['admin', 'buyer']);

    middleware(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 403,
        code: 'AUTH_011',
      })
    );
  });

  it('should call next with 401 if user is missing', () => {
    mockRequest.user = undefined;
    const middleware = authorize(['admin']);

    middleware(mockRequest as AppRequest, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 401,
        code: 'AUTH_009',
      })
    );
  });
});
