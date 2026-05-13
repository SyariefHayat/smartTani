import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';
import MidtransManager from '../lib/midtrans';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  };
});

jest.mock('../lib/midtrans');
jest.mock('../lib/broker');

describe('Payment Routes', () => {
  const prisma = new PrismaClient();
  const mockSnap = {
    createTransaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (MidtransManager.getSnap as jest.Mock).mockReturnValue(mockSnap);
  });

  describe('POST /payments/initiate', () => {
    it('should return 200 and payment URL when successful', async () => {
      const mockOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        buyer_id: 'user-1',
        status: 'pending_payment',
        total_amount: 100000,
        platform_fee: 2000,
        shipping_cost: 15000,
        items: [
          {
            product_id: 'prod-1',
            price_per_unit: 50000,
            quantity: 2,
          },
        ],
      };

      (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
      mockSnap.createTransaction.mockResolvedValue({
        redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/123',
        token: 'token-123',
      });
      (prisma.order.update as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post('/payments/initiate')
        .set('X-User-Id', 'user-1')
        .set('X-User-Role', 'buyer')
        .set('X-User-Email', 'buyer@example.com')
        .set('X-User-Full-Name', 'Buyer One')
        .send({ orderId: mockOrder.id });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.paymentUrl).toBe(
        'https://app.sandbox.midtrans.com/snap/v2/vtweb/123'
      );
      expect(prisma.order.findUnique).toHaveBeenCalled();
      expect(mockSnap.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          transaction_details: {
            order_id: mockOrder.id,
            gross_amount: 100000,
          },
          customer_details: {
            first_name: 'Buyer One',
            email: 'buyer@example.com',
          },
        })
      );
    });

    it('should return 403 if user is not the owner of the order', async () => {
      const mockOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        buyer_id: 'user-2',
        status: 'pending_payment',
      };

      (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .post('/payments/initiate')
        .set('X-User-Id', 'user-1')
        .set('X-User-Role', 'buyer')
        .send({ orderId: mockOrder.id });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });

    it('should return 400 if order status is not pending_payment', async () => {
      const mockOrder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        buyer_id: 'user-1',
        status: 'paid',
      };

      (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .post('/payments/initiate')
        .set('X-User-Id', 'user-1')
        .set('X-User-Role', 'buyer')
        .send({ orderId: mockOrder.id });

      expect(response.status).toBe(400);
    });

    it('should return 401 if unauthorized', async () => {
      const response = await request(app)
        .post('/payments/initiate')
        .send({ orderId: '123e4567-e89b-12d3-a456-426614174000' });

      expect(response.status).toBe(401);
    });
  });
});
