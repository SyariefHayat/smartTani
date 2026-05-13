import request from 'supertest';
import { app } from '../index';
import RedisClient from '../lib/redis';

jest.mock('../lib/broker');

describe('Gateway Rate Limiting', () => {
  const mockClient = RedisClient.getInstance();

  beforeEach(() => {
    jest.clearAllMocks();
    // Default mock behavior for successful requests
    (mockClient.call as jest.Mock).mockImplementation(
      async (command: string, ...args: unknown[]) => {
        const cmd = command.toLowerCase();
        if (cmd === 'script' || cmd === 'eval' || cmd === 'evalsha') {
          if (args[0] === 'LOAD' || args[0] === 'load') return 'mock-sha';
          return [1, Date.now() + 60000]; // totalHits = 1
        }
        return 'OK';
      }
    );
  });

  it('should allow requests under the limit', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });

  it('should return 429 when limit is exceeded', async () => {
    // Mock Redis to return hits exceeding limit
    (mockClient.call as jest.Mock).mockImplementation(
      async (command: string, ..._args: unknown[]) => {
        const cmd = command.toLowerCase();
        if (cmd === 'evalsha' || cmd === 'eval') {
          return [1001, Date.now() + 60000]; // current hits = 1001
        }
        if (cmd === 'script') return 'mock-sha';
        return 'OK';
      }
    );

    const response = await request(app).get('/health');
    expect(response.status).toBe(429);
    expect(response.body.error.code).toBe('AUTH_006');
    expect(response.headers).toHaveProperty('retry-after');
  });
});
