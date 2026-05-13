import { handleMulterError } from './upload.middleware';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

describe('Upload Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should handle LIMIT_FILE_SIZE error', () => {
    const error = new multer.MulterError('LIMIT_FILE_SIZE');
    handleMulterError(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        code: 'MARKET_002',
      })
    );
  });

  it('should handle invalid format error', () => {
    const error = new Error('Format file tidak valid');
    handleMulterError(
      error as Error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        code: 'MARKET_003',
      })
    );
  });

  it('should pass other errors to next', () => {
    const error = new Error('Other error');
    handleMulterError(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(error);
  });
});
