import userRepository from './user.repository';
import prisma from '../lib/prisma';

jest.mock('../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('UserRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should find user by email', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await userRepository.findByEmail('test@test.com');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@test.com' },
    });
    expect(result).toEqual(mockUser);
  });

  it('should find user by id', async () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await userRepository.findById('1');

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual(mockUser);
  });

  it('should create a user', async () => {
    const userData = { email: 'new@test.com', password: 'hash', role: 'buyer' };
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: '2', ...userData });

    // @ts-expect-error - testing partial input
    const result = await userRepository.create(userData);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: userData,
    });
    expect(result.email).toBe(userData.email);
  });

  it('should update user status', async () => {
    (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', status: 'active' });

    const result = await userRepository.updateStatus('1', 'active');

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { status: 'active' },
    });
    expect(result.status).toBe('active');
  });

  it('should update user profile', async () => {
    const updateData = { full_name: 'New Name' };
    (prisma.user.update as jest.Mock).mockResolvedValue({ id: '1', ...updateData });

    const result = await userRepository.update('1', updateData);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: updateData,
    });
    expect(result.full_name).toBe('New Name');
  });

  it('should find all users with filters', async () => {
    const users = [{ id: '1', email: 'u1@test.com' }];
    (prisma.user.findMany as jest.Mock).mockResolvedValue(users);
    (prisma.user.count as jest.Mock).mockResolvedValue(1);

    const result = await userRepository.findAll({
      role: 'admin',
      status: 'active',
      page: 2,
      limit: 10,
    });

    expect(prisma.user.findMany).toHaveBeenCalledWith({
      where: { role: 'admin', status: 'active' },
      skip: 10,
      take: 10,
      orderBy: { created_at: 'desc' },
    });
    expect(result.users).toEqual(users);
    expect(result.total).toBe(1);
  });
});
