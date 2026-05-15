process.env.NODE_ENV = 'test';
process.env.PORT = '3007';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

jest.mock('./src/lib/redis', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockReturnValue({
      ping: jest.fn().mockResolvedValue('PONG'),
    }),
    get: jest.fn(),
    set: jest.fn(),
    setex: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $connect: jest.fn().mockResolvedValue(undefined),
      $disconnect: jest.fn().mockResolvedValue(undefined),
    })),
  };
});
