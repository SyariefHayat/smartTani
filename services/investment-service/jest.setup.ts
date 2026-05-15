process.env.NODE_ENV = 'test';
process.env.PORT = '3004';

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

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
      proposal: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    })),
  };
});
