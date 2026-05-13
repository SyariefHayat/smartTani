import orderController from './order.controller';
import orderService from '../services/order.service';
import { Request, Response, NextFunction } from 'express';
import { AppRequest } from '../../../../shared/types/express';

jest.mock('../services/order.service');

describe('OrderController', () => {
  let mockRequest: Partial<AppRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      user: { id: 'u1', role: 'buyer', email: 'u1@test.com' },
      body: { shippingAddress: {} },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call checkout successfully', async () => {
    (orderService.checkout as jest.Mock).mockResolvedValue({ id: 'o1' });

    await orderController.checkout(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(orderService.checkout).toHaveBeenCalledWith('u1', mockRequest.body);
  });

  it('should pass error to next if checkout fails', async () => {
    const error = new Error('Checkout failed');
    (orderService.checkout as jest.Mock).mockRejectedValue(error);

    await orderController.checkout(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalledWith(error);
  });
});
