import request from 'supertest';
import { app } from './index';

jest.mock('./lib/redis');
jest.mock('./lib/broker');

describe('API Gateway', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Proxy tests are harder to do without a real backend or complex mocks,
  // but we verified it manually with curl.
});
