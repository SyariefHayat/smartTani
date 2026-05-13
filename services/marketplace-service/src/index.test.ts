import request from 'supertest';
import { app } from './index';
import MessageBroker from './lib/broker';

jest.mock('./lib/broker');

describe('Marketplace Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (MessageBroker.connect as jest.Mock).mockResolvedValue(undefined);
  });

  it('should return 200 for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.dependencies).toEqual({
      mongodb: 'ok',
      redis: 'ok',
      s3: 'ok',
    });
  });
});
