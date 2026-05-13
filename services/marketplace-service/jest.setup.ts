process.env.NODE_ENV = 'test';
process.env.PORT = '3002';
process.env.MONGODB_URL = 'mongodb://localhost:27017/smarttani_marketplace_test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.AWS_ACCESS_KEY_ID = 'test_key';
process.env.AWS_SECRET_ACCESS_KEY = 'test_secret';
process.env.AWS_BUCKET_NAME = 'test_bucket';
process.env.AWS_REGION = 'us-east-1';
process.env.RABBITMQ_URL = 'amqp://localhost:5672';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

jest.mock('./src/lib/redis', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockReturnValue({
      ping: jest.fn().mockResolvedValue('PONG'),
      call: jest.fn().mockResolvedValue('OK'),
    }),
  },
}));

jest.mock('./src/lib/s3', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({ Buckets: [] }),
    }),
    uploadFile: jest.fn().mockResolvedValue('http://s3/mock-image.webp'),
  },
}));

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(actualMongoose),
    connection: {
      readyState: 1,
    },
  };
});
