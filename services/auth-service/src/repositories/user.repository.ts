import { PrismaClient, User, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export class UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateStatus(id: string, status: string): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async findAll(params: {
    role?: string;
    status?: string;
    page: number;
    limit: number;
  }): Promise<{ users: User[]; total: number }> {
    const { role, status, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};
    if (role) where.role = role;
    if (status) where.status = status;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }
}

export default new UserRepository();
