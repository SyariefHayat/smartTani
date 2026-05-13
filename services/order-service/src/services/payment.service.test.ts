import paymentService from './payment.service';
import MidtransManager from '../lib/midtrans';
import { PrismaClient } from '@prisma/client';

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
    expect(mockSnap.createTransaction).toHaveBeenCalledWith(
      expect.objectContaining({
        transaction_details: { order_id: 'o1', gross_amount: 100000 },
      })
    );
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

  it('should throw 404 if order not found', async () => {
    (prisma.order.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(
      paymentService.initiatePayment('u1', 'test@test.com', 'Test User', { orderId: 'o1' })
    ).rejects.toThrow('Order tidak ditemukan');
  });
});
