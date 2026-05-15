import { PrismaClient, Order, Prisma } from '@prisma/client';
import prisma from '../lib/prisma';

export class OrderRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<(Order & { items: any[] }) | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
      },
    }) as Promise<(Order & { items: any[] }) | null>;
  }

  async findAll(params: {
    userId?: string;
    role?: string;
    status?: string;
    from_date?: string;
    to_date?: string;
    page: number;
    limit: number;
  }): Promise<{ orders: any[]; total: number }> {
    const { userId, role, status, from_date, to_date, page, limit } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {};

    // Filter by Role
    if (role === 'petani' && userId) {
      where.items = {
        some: {
          farmer_id: userId,
        },
      };
    } else if (role === 'admin') {
      // Admin sees all
    } else if (userId) {
      // Buyer/Distributor see own
      where.buyer_id = userId;
    }

    // Filter by Status
    if (status) {
      where.status = status;
    }

    // Filter by Date Range
    if (from_date || to_date) {
      where.created_at = {};
      if (from_date) where.created_at.gte = new Date(from_date);
      if (to_date) where.created_at.lte = new Date(to_date);
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: true,
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { orders, total };
  }

  async updateStatus(id: string, status: string): Promise<any> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });
  }

  async completeOrder(id: string): Promise<any> {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'delivered',
        completed_at: new Date(),
      },
      include: {
        items: true,
      },
    });
  }

  async requestRefund(id: string, reason: string): Promise<any> {
    return this.prisma.order.update({
      where: { id },
      data: {
        status: 'refund_requested',
        refund_reason: reason,
      },
      include: {
        items: true,
      },
    });
  }

  async create(data: Prisma.OrderCreateInput): Promise<Order> {
    return this.prisma.order.create({
      data,
      include: {
        items: true,
      },
    });
  }

  // Add transaction helper if needed
  get tx() {
    return this.prisma;
  }
}

export default new OrderRepository();
