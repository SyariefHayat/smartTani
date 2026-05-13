import paymentService from './payment.service';
import MidtransManager from '../lib/midtrans';
import { PrismaClient } from '@prisma/client';
import MessageBroker from '../lib/broker';
import marketplaceClient from '../lib/marketplace-client';
import * as verifyUtils from '../lib/midtrans-verify';

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
jest.mock('../lib/marketplace-client');
jest.mock('../lib/midtrans-verify');

describe('PaymentService', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prisma: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSnap: any;

  beforeEach(() => {
    prisma = new PrismaClient();
    mockSnap = {
      createTransaction: jest.fn(),
    };
    (MidtransManager.getSnap as jest.Mock).mockReturnValue(mockSnap);
    jest.clearAllMocks();
  });

  describe('initiatePayment', () => {
    it('should initiate payment successfully', async () => {
      const mockOrder = {
        id: 'o1',
        buyer_id: 'u1',
        status: 'pending_payment',
        total_amount: 100000,
        items: [{ product_id: 'p1', price_per_unit: 50000, quantity: 2 }],
        platform_fee: 2000,
        shipping_cost: 15000,
      };
      const mockTransaction = { redirect_url: 'http://midtrans/pay' };

      (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);
      mockSnap.createTransaction.mockResolvedValue(mockTransaction);
      (prisma.order.update as jest.Mock).mockResolvedValue({});

      const result = await paymentService.initiatePayment('u1', 'test@test.com', 'Test User', {
        orderId: 'o1',
      });

      expect(prisma.order.findUnique).toHaveBeenCalled();
      expect(mockSnap.createTransaction).toHaveBeenCalled();
      expect(prisma.order.update).toHaveBeenCalled();
      expect(result.paymentUrl).toBe(mockTransaction.redirect_url);
    });

    it('should throw 403 if user is not the buyer', async () => {
      const mockOrder = { id: 'o1', buyer_id: 'u1', status: 'pending_payment' };
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(mockOrder);

      await expect(
        paymentService.initiatePayment('u2', 'test@test.com', 'Test User', { orderId: 'o1' })
      ).rejects.toThrow('Anda tidak memiliki akses');
    });
  });

  describe('handleWebhook', () => {
    const mockWebhookData = {
      order_id: 'o1',
      status_code: '200',
      gross_amount: '117000.00',
      signature_key: 'valid-sig',
      transaction_status: 'settlement',
    };

    it('should update status to paid on settlement', async () => {
      (verifyUtils.verifyMidtransSignature as jest.Mock).mockReturnValue(true);
      (prisma.order.findUnique as jest.Mock).mockResolvedValue({
        id: 'o1',
        status: 'pending_payment',
        total_amount: 117000,
      });
      (prisma.order.update as jest.Mock).mockResolvedValue({});
      (MessageBroker.publish as jest.Mock).mockResolvedValue({});

      const result = await paymentService.handleWebhook(mockWebhookData);

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'o1' },
          data: { status: 'paid' },
        })
      );
      expect(MessageBroker.publish).toHaveBeenCalled();
      expect(result.message).toContain('paid');
    });

    it('should update status to cancelled and restore stock on cancel', async () => {
      const cancelData = { ...mockWebhookData, transaction_status: 'cancel' };
      (verifyUtils.verifyMidtransSignature as jest.Mock).mockReturnValue(true);
      (prisma.order.findUnique as jest.Mock).mockResolvedValue({
        id: 'o1',
        status: 'pending_payment',
        items: [{ product_id: 'p1', quantity: 1 }],
      });
      (prisma.order.update as jest.Mock).mockResolvedValue({});

      const result = await paymentService.handleWebhook(cancelData);

      expect(prisma.order.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { status: 'cancelled' },
        })
      );
      expect(marketplaceClient.restoreStock).toHaveBeenCalled();
      expect(result.message).toContain('cancelled');
    });

    it('should throw 403 if signature is invalid', async () => {
      (verifyUtils.verifyMidtransSignature as jest.Mock).mockReturnValue(false);

      await expect(paymentService.handleWebhook(mockWebhookData)).rejects.toThrow(
        'Invalid signature'
      );
    });
  });
});
