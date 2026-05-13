process.env.NODE_ENV = 'test';
process.env.PORT = '3003';
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/order_test';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.RABBITMQ_URL = 'amqp://localhost:5672';
process.env.MIDTRANS_SERVER_KEY = 'test_server_key';
process.env.MIDTRANS_CLIENT_KEY = 'test_client_key';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

jest.mock('./src/lib/redis', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockReturnValue({
      ping: jest.fn().mockResolvedValue('PONG'),
      call: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
    }),
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn(),
    process: jest.fn(),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
  })),
}));

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
      order: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    })),
  };
});
