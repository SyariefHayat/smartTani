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

  it('should return cart from redis', async () => {
    const mockCart = [{ productId: 'p1', quantity: 1 }];
    (RedisClient.get as jest.Mock).mockResolvedValue(mockCart);

    const result = await cartService.getCart('u1');
    expect(result).toEqual(mockCart);
  });
});
