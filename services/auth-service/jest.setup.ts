process.env.NODE_ENV = 'test';
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://smarttani_user:smarttani_pass@localhost:5432/smarttani_test';
process.env.REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
process.env.JWT_SECRET = 'test_secret';
process.env.JWT_EXPIRES_IN = '1h';
process.env.REFRESH_TOKEN_EXPIRES_IN = '7d';
process.env.RABBITMQ_URL = 'amqp://localhost:5672';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
