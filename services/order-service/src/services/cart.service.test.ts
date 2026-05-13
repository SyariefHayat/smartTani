import cartService from './cart.service';
import marketplaceClient from '../lib/marketplace-client';
import RedisClient from '../lib/redis';

jest.mock('../lib/marketplace-client');
jest.mock('../lib/redis', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockReturnValue({
      ping: jest.fn().mockResolvedValue('PONG'),
      call: jest.fn().mockResolvedValue('OK'),
    }),
    get: jest.fn(),
    setex: jest.fn(),
  },
}));

describe('CartService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should add item to cart successfully', async () => {
    const mockProduct = {
      _id: 'p1',
      farmer_id: 'f1',
      title: 'Product 1',
      price_per_unit: 1000,
      unit: 'kg',
      stock: 10,
      min_order: 1,
      status: 'active',
    };
    (marketplaceClient.getProductInfo as jest.Mock).mockResolvedValue(mockProduct);
    (RedisClient.get as jest.Mock).mockResolvedValue([]);

    const result = await cartService.addToCart('u1', { productId: 'p1', quantity: 2 });

    expect(RedisClient.setex).toHaveBeenCalledWith(
      'cart:u1',
      604800,
      expect.arrayContaining([
        expect.objectContaining({
          productId: 'p1',
          quantity: 2,
          subtotal: 2000,
        }),
      ])
    );
    expect(result.length).toBe(1);
  });

  it('should update quantity if item already in cart', async () => {
    const mockProduct = {
      _id: 'p1',
      farmer_id: 'f1',
      title: 'Product 1',
      price_per_unit: 1000,
      unit: 'kg',
      stock: 10,
      min_order: 1,
      status: 'active',
    };
    (marketplaceClient.getProductInfo as jest.Mock).mockResolvedValue(mockProduct);
    (RedisClient.get as jest.Mock).mockResolvedValue([
      { productId: 'p1', quantity: 1, subtotal: 1000 },
    ]);

    const result = await cartService.addToCart('u1', { productId: 'p1', quantity: 2 });

    expect(RedisClient.setex).toHaveBeenCalledWith(
      'cart:u1',
      604800,
      expect.arrayContaining([
        expect.objectContaining({
          productId: 'p1',
          quantity: 3,
          subtotal: 3000,
        }),
      ])
    );
    expect(result.length).toBe(1);
  });

  it('should throw error if quantity < min_order', async () => {
    (marketplaceClient.getProductInfo as jest.Mock).mockResolvedValue({
      status: 'active',
      min_order: 5,
      unit: 'kg',
      stock: 10,
    });

    await expect(cartService.addToCart('u1', { productId: 'p1', quantity: 2 })).rejects.toThrow(
      'Minimal order adalah 5 kg'
    );
  });

  it('should throw error if quantity > stock', async () => {
    (marketplaceClient.getProductInfo as jest.Mock).mockResolvedValue({
      status: 'active',
      min_order: 1,
      unit: 'kg',
      stock: 5,
    });

    await expect(cartService.addToCart('u1', { productId: 'p1', quantity: 10 })).rejects.toThrow(
      'Stok tidak mencukupi'
    );
  });

  it('should throw error if product not found', async () => {
    (marketplaceClient.getProductInfo as jest.Mock).mockResolvedValue(null);

    await expect(cartService.addToCart('u1', { productId: 'p1', quantity: 1 })).rejects.toThrow(
      'Produk tidak ditemukan'
    );
  });

  it('should throw error if product is not active', async () => {
    (marketplaceClient.getProductInfo as jest.Mock).mockResolvedValue({
      status: 'inactive',
    });

    await expect(cartService.addToCart('u1', { productId: 'p1', quantity: 1 })).rejects.toThrow(
      'Produk tidak tersedia'
    );
  });

  it('should return enriched cart with real-time data from redis', async () => {
    const mockCart = [{ productId: 'p1', quantity: 1, price_per_unit: 1000, subtotal: 1000 }];
    const mockProduct = {
      _id: 'p1',
      status: 'active',
      price_per_unit: 1200, // Price updated
      stock: 10,
      min_order: 1,
      unit: 'kg',
    };
    (RedisClient.get as jest.Mock).mockResolvedValue(mockCart);
    (marketplaceClient.getProductInfo as jest.Mock).mockResolvedValue(mockProduct);

    const result = await cartService.getCart('u1');

    expect(result.items[0].price_per_unit).toBe(1200);
    expect(result.items[0].subtotal).toBe(1200);
    expect(result.items[0].isAvailable).toBe(true);
    expect(result.total).toBe(1200);
  });

  it('should mark items as unavailable if stock is insufficient', async () => {
    const mockCart = [{ productId: 'p1', quantity: 10, subtotal: 10000 }];
    const mockProduct = {
      _id: 'p1',
      status: 'active',
      price_per_unit: 1000,
      stock: 5, // Less than quantity
      min_order: 1,
    };
    (RedisClient.get as jest.Mock).mockResolvedValue(mockCart);
    (marketplaceClient.getProductInfo as jest.Mock).mockResolvedValue(mockProduct);

    const result = await cartService.getCart('u1');

    expect(result.items[0].isAvailable).toBe(false);
    expect(result.items[0].reason).toContain('Stok tidak mencukupi');
    expect(result.total).toBe(0);
  });

  describe('removeFromCart', () => {
    it('should remove item from cart successfully', async () => {
      const mockCart = [
        { productId: 'p1', quantity: 1 },
        { productId: 'p2', quantity: 2 },
      ];
      (RedisClient.get as jest.Mock).mockResolvedValue(mockCart);

      const result = await cartService.removeFromCart('u1', 'p1');

      expect(RedisClient.setex).toHaveBeenCalledWith('cart:u1', 604800, [
        { productId: 'p2', quantity: 2 },
      ]);
      expect(result.length).toBe(1);
      expect(result[0].productId).toBe('p2');
    });
  });
});
