import orderService from './order.service';
import cartService from './cart.service';
import marketplaceClient from '../lib/marketplace-client';
import { paymentTimeoutQueue } from '../lib/queue';
import RedisClient from '../lib/redis';

jest.mock('./cart.service');
jest.mock('../lib/marketplace-client');
jest.mock('../lib/queue');
jest.mock('../lib/redis');
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $transaction: jest.fn().mockImplementation((callback) =>
        callback({
          order: {
            create: jest.fn().mockResolvedValue({ id: 'order-1', total_amount: 1000 }),
          },
        })
      ),
    })),
  };
});

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should checkout successfully', async () => {
    const mockCart = {
      items: [
        {
          productId: 'p1',
          farmerId: 'f1',
          title: 'Prod 1',
          price_per_unit: 1000,
          quantity: 2,
          subtotal: 2000,
          isAvailable: true,
        },
      ],
      total: 2000,
    };
    (cartService.getCart as jest.Mock).mockResolvedValue(mockCart);
    (marketplaceClient.reduceStock as jest.Mock).mockResolvedValue(true);

    const result = await orderService.checkout('u1', {
      shippingAddress: { province: 'P', city: 'C', full_address: 'Addr 1' },
    });

    expect(cartService.getCart).toHaveBeenCalledWith('u1');
    expect(marketplaceClient.reduceStock).toHaveBeenCalled();
    expect(RedisClient.del).toHaveBeenCalledWith('cart:u1');
    expect(paymentTimeoutQueue.add).toHaveBeenCalledWith(
      'cancel-order',
      { orderId: 'order-1' },
      expect.any(Object)
    );
    expect(result.id).toBe('order-1');
  });

  it('should throw error if cart is empty', async () => {
    (cartService.getCart as jest.Mock).mockResolvedValue({ items: [], total: 0 });

    await expect(
      orderService.checkout('u1', {
        shippingAddress: { province: 'P', city: 'C', full_address: 'Addr 1' },
      })
    ).rejects.toThrow('Keranjang belanja kosong');
  });

  it('should throw error if stock reduction fails', async () => {
    (cartService.getCart as jest.Mock).mockResolvedValue({
      items: [{ isAvailable: true }],
      total: 1000,
    });
    (marketplaceClient.reduceStock as jest.Mock).mockResolvedValue(false);

    await expect(
      orderService.checkout('u1', {
        shippingAddress: { province: 'P', city: 'C', full_address: 'Addr 1' },
      })
    ).rejects.toThrow('Gagal mengamankan stok produk');
  });

  it('should throw error if items are not available', async () => {
    (cartService.getCart as jest.Mock).mockResolvedValue({
      items: [{ isAvailable: false }],
      total: 0,
    });

    await expect(
      orderService.checkout('u1', {
        shippingAddress: { province: 'P', city: 'C', full_address: 'Addr 1' },
      })
    ).rejects.toThrow('Beberapa produk dalam keranjang tidak tersedia');
  });
});
