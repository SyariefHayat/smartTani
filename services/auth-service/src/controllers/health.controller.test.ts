import { getHealth } from './health.controller';
import prisma from '../lib/prisma';
import RedisClient from '../lib/redis';
import { Request, Response } from 'express';

jest.mock('../lib/prisma', () => ({
  $queryRaw: jest.fn(),
}));
jest.mock('../lib/redis', () => ({
  getInstance: jest.fn().mockReturnValue({
    ping: jest.fn(),
  }),
}));

describe('HealthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonFn: jest.Mock;
  let statusFn: jest.Mock;

  beforeEach(() => {
    jsonFn = jest.fn();
    statusFn = jest.fn().mockReturnValue({ json: jsonFn });
    mockRequest = {};
    mockResponse = {
      status: statusFn,
      json: jsonFn,
    };
    jest.clearAllMocks();
  });

  it('should return 200 and ok status if all dependencies are healthy', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ 1: 1 }]);
    const mockRedis = RedisClient.getInstance();
    (mockRedis.ping as jest.Mock).mockResolvedValue('PONG');

    await getHealth(mockRequest as Request, mockResponse as Response);

    expect(jsonFn).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'ok',
        dependencies: {
          postgres: 'ok',
          redis: 'ok',
        },
      })
    );
  });

  it('should return 503 if a dependency is unhealthy', async () => {
    (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error('DB Down'));
    const mockRedis = RedisClient.getInstance();
    (mockRedis.ping as jest.Mock).mockResolvedValue('PONG');

    await getHealth(mockRequest as Request, mockResponse as Response);

    expect(statusFn).toHaveBeenCalledWith(503);
    expect(jsonFn).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
      })
    );
  });
});
