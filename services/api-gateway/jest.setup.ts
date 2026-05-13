process.env.NODE_ENV = 'test';
process.env.PORT = '3000';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.JWT_SECRET = 'test_secret_key_at_least_32_characters_long';
process.env.RABBITMQ_URL = 'amqp://localhost:5672';
process.env.AUTH_SERVICE_URL = 'http://localhost:3001';
process.env.MARKETPLACE_SERVICE_URL = 'http://localhost:3002';
process.env.ORDER_SERVICE_URL = 'http://localhost:3003';
process.env.INVESTMENT_SERVICE_URL = 'http://localhost:3004';
process.env.LOGISTICS_SERVICE_URL = 'http://localhost:3005';
process.env.NOTIFICATION_SERVICE_URL = 'http://localhost:3006';
process.env.ANALYTICS_SERVICE_URL = 'http://localhost:3007';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest
    .fn()
    .mockReturnValue((_req: unknown, _res: unknown, next: () => void) => next()),
}));
