import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    order: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  };
});

jest.mock('../lib/broker');
jest.mock('../lib/queue');
jest.mock('../lib/redis');

describe('Order Routes', () => {
  const prisma = new PrismaClient();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('should return 200 and list of orders for buyer', async () => {
      const mockOrders = [{ id: 'o1', buyer_id: 'u1', total_amount: 10000, items: [] }];
      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
      (prisma.order.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .get('/orders')
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ buyer_id: 'u1' }),
        })
      );
    });

    it('should return 200 and list of orders for petani containing their products', async () => {
      const mockOrders = [
        { id: 'o1', buyer_id: 'u2', total_amount: 20000, items: [{ farmer_id: 'f1' }] },
      ];
      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrders);
      (prisma.order.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .get('/orders')
        .set('X-User-Id', 'f1')
        .set('X-User-Role', 'petani');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            items: { some: { farmer_id: 'f1' } },
          }),
        })
      );
    });

    it('should apply status filter', async () => {
      (prisma.order.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.order.count as jest.Mock).mockResolvedValue(0);

      await request(app)
        .get('/orders?status=paid')
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'paid' }),
        })
      );
    });

    it('should apply date range filter', async () => {
      (prisma.order.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.order.count as jest.Mock).mockResolvedValue(0);

      const from = '2026-01-01T00:00:00.000Z';
      const to = '2026-01-31T23:59:59.000Z';

      await request(app)
        .get(`/orders?from_date=${from}&to_date=${to}`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(prisma.order.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            created_at: {
              gte: new Date(from),
              lte: new Date(to),
            },
          }),
        })
      );
    });
  });
});
