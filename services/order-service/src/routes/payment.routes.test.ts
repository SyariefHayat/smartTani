import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';
import MidtransManager from '../lib/midtrans';
import * as verifyUtils from '../lib/midtrans-verify';
import { paymentTimeoutQueue } from '../lib/queue';
import MessageBroker from '../lib/broker';

jest.mock('@prisma/client', () => {
  const mockPrisma = {
    order: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
  };
});

jest.mock('../lib/midtrans');
jest.mock('../lib/broker', () => ({
  publish: jest.fn().mockResolvedValue({}),
}));
jest.mock('../lib/midtrans-verify');
jest.mock('../lib/queue', () => ({
  paymentTimeoutQueue: {
    add: jest.fn(),
    getJob: jest.fn(),
  },
}));

describe('Payment Routes', () => {
  const prisma = new PrismaClient();
  const mockSnap = {
    createTransaction: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (MidtransManager.getSnap as jest.Mock).mockReturnValue(mockSnap);
    (MessageBroker.publish as jest.Mock).mockResolvedValue({});
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
    });
  });

  describe('POST /payments/webhook', () => {
    it('should return 200 and update status when signature is valid', async () => {
      const webhookData = {
        order_id: 'o1',
        status_code: '200',
        gross_amount: '100000.00',
        signature_key: 'valid-sig',
        transaction_status: 'settlement',
      };

      const mockOrder = {
        id: 'o1',
        buyer_id: 'user-1',
        status: 'pending_payment',
        total_amount: 100000,
        items: [],
      };

      (verifyUtils.verifyMidtransSignature as jest.Mock).mockReturnValue(true);
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
      (prisma.order.update as jest.Mock).mockResolvedValue({});
      (paymentTimeoutQueue.getJob as jest.Mock).mockResolvedValue({ remove: jest.fn() });

      const response = await request(app).post('/payments/webhook').send(webhookData);

      expect(response.status).toBe(200);
      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: 'paid',
            paid_at: expect.any(Date),
          }),
        })
      );
    });

    it('should return 400 when signature is invalid', async () => {
      const webhookData = {
        order_id: 'o1',
        status_code: '200',
        gross_amount: '100000.00',
        signature_key: 'invalid-sig',
        transaction_status: 'settlement',
      };

      (verifyUtils.verifyMidtransSignature as jest.Mock).mockReturnValue(false);

      const response = await request(app).post('/payments/webhook').send(webhookData);

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Invalid signature');
    });
  });
});
