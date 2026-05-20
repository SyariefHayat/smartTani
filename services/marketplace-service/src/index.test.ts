import request from 'supertest';
import { app } from './index';
import MessageBroker from './lib/broker';
import Category from './models/category.model';
import { Product } from './models/product.model';
import { Review } from './models/review.model';
import orderServiceClient from './lib/order-client';
import S3Manager from './lib/s3';
import RedisClient from './lib/redis';
import sharp from 'sharp';

jest.mock('./lib/broker');
jest.mock('./models/category.model');
jest.mock('./models/product.model');
jest.mock('./models/review.model');
jest.mock('./lib/order-client');
jest.mock('./lib/s3');
jest.mock('./lib/auth-client');
jest.mock('./lib/redis', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn().mockReturnValue({
      ping: jest.fn().mockResolvedValue('PONG'),
      call: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
    }),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    setex: jest.fn().mockResolvedValue('OK'),
    del: jest.fn().mockResolvedValue(1),
  },
}));
jest.mock('sharp', () => {
  return jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
  }));
});

describe('Marketplace Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    (MessageBroker.connect as jest.Mock).mockResolvedValue(undefined);

    // Re-setup essential mocks that were reset
    (RedisClient.getInstance as jest.Mock).mockReturnValue({
      ping: jest.fn().mockResolvedValue('PONG'),
      call: jest.fn().mockResolvedValue('OK'),
      del: jest.fn().mockResolvedValue(1),
      send: jest.fn().mockResolvedValue({}),
    });
    (RedisClient.get as jest.Mock).mockResolvedValue(null);
    (RedisClient.set as jest.Mock).mockResolvedValue('OK');
    (RedisClient.setex as jest.Mock).mockResolvedValue('OK');
    (RedisClient.del as jest.Mock).mockResolvedValue(1);

    (S3Manager.getInstance as jest.Mock).mockReturnValue({
      send: jest.fn().mockResolvedValue({}),
    });

    (sharp as unknown as jest.Mock).mockImplementation(() => ({
      resize: jest.fn().mockReturnThis(),
      webp: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
    }));
  });

  it('should return 200 for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.dependencies).toEqual({
      mongodb: 'ok',
      redis: 'ok',
      s3: 'ok',
    });
  });

  it('should return 200 and list of categories (with caching)', async () => {
    const mockCategories = [{ name: 'Sayuran', slug: 'sayuran' }];

    // First call: Cache miss
    (RedisClient.get as jest.Mock).mockResolvedValue(null);
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockCategories),
    });

    const response1 = await request(app).get('/categories');
    expect(response1.status).toBe(200);
    expect(response1.body.data).toEqual(mockCategories);
    expect(RedisClient.setex).toHaveBeenCalled();

    // Second call: Cache hit
    jest.clearAllMocks();
    (RedisClient.get as jest.Mock).mockResolvedValue(mockCategories);

    const response2 = await request(app).get('/categories');
    expect(response2.status).toBe(200);
    expect(response2.body.data).toEqual(mockCategories);
    expect(Category.find).not.toHaveBeenCalled();
  });

  describe('POST /products', () => {
    const validProduct = {
      title: 'Cabe Rawit Pedas',
      description: 'Cabe rawit merah pilihan dengan tingkat kepedasan tinggi.',
      category: 'Sayuran',
      price_per_unit: 50000,
      unit: 'kg',
      stock: 50,
      min_order: 1,
      location: {
        province: 'Jawa Timur',
        city: 'Malang',
      },
    };

    it('should create product successfully as petani', async () => {
      (Product.create as jest.Mock).mockResolvedValue({
        _id: 'uuid',
        ...validProduct,
        farmer_id: 'farmer-1',
        status: 'active',
      });

      const response = await request(app)
        .post('/products')
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani')
        .send(validProduct);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(validProduct.title);
    });

    it('should return 401 if context headers are missing', async () => {
      const response = await request(app).post('/products').send(validProduct);

      expect(response.status).toBe(401);
    });

    it('should return 403 if role is not allowed (buyer)', async () => {
      const response = await request(app)
        .post('/products')
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer')
        .send(validProduct);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /products', () => {
    it('should return list of products', async () => {
      (Product.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(0);

      const response = await request(app).get('/products');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should handle pagination correctly', async () => {
      const skipMock = jest.fn().mockReturnThis();
      const limitMock = jest.fn().mockResolvedValue([]);
      (Product.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: skipMock,
          limit: limitMock,
        }),
      });

      await request(app).get('/products?page=2&limit=5');

      expect(skipMock).toHaveBeenCalledWith(5);
      expect(limitMock).toHaveBeenCalledWith(5);
    });

    it('should filter by price range', async () => {
      (Product.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });

      await request(app).get('/products?min_price=1000&max_price=5000');

      expect(Product.find).toHaveBeenCalledWith(
        expect.objectContaining({
          price_per_unit: { $gte: 1000, $lte: 5000 },
        })
      );
    });
  });

  describe('PATCH /products/:id', () => {
    const productId = '6a03d00c22e9882dac8e0a55';
    const updateData = { title: 'Updated Title' };
    const mockProduct = {
      _id: productId,
      farmer_id: 'farmer-1',
      title: 'Original Title',
      location: { city: 'Bandung', province: 'Jawa Barat' },
    };

    it('should update product successfully as owner', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockProduct,
        ...updateData,
      });

      const response = await request(app)
        .patch(`/products/${productId}`)
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(updateData.title);
    });

    it('should return 403 if user is not the owner', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app)
        .patch(`/products/${productId}`)
        .set('X-User-Id', 'farmer-2')
        .set('X-User-Role', 'petani')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(403);
    });

    it('should allow admin to update any product', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockProduct,
        title: 'Admin Edit',
      });

      const response = await request(app)
        .patch(`/products/${productId}`)
        .set('X-User-Id', 'admin-1')
        .set('X-User-Role', 'admin')
        .send({ title: 'Admin Edit' });

      expect(response.status).toBe(200);
    });

    it('should return 404 if product to update is not found', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch(`/products/${productId}`)
        .set('X-User-Id', 'admin-1')
        .set('X-User-Role', 'admin')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /products/:id', () => {
    const productId = '6a03d00c22e9882dac8e0a55';
    const mockProduct = {
      _id: productId,
      farmer_id: 'farmer-1',
    };

    it('should deactivate product successfully as owner', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        ...mockProduct,
        status: 'inactive',
      });

      const response = await request(app)
        .delete(`/products/${productId}`)
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani');

      expect(response.status).toBe(200);
      expect(response.body.data.message).toBe('Produk berhasil dinonaktifkan');
    });

    it('should return 403 if user is not the owner', async () => {
      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

      const response = await request(app)
        .delete(`/products/${productId}`)
        .set('X-User-Id', 'farmer-2')
        .set('X-User-Role', 'petani');

      expect(response.status).toBe(403);
    });
  });

  describe('POST /products/:id/images', () => {
    it('should upload image successfully', async () => {
      const productId = '6a03d00c22e9882dac8e0a55';
      (Product.findById as jest.Mock).mockResolvedValue({
        _id: productId,
        farmer_id: 'farmer-1',
        images: [],
      });
      (S3Manager.uploadFile as jest.Mock).mockResolvedValue('http://s3/img.webp');
      (Product.findByIdAndUpdate as jest.Mock).mockResolvedValue({});

      const response = await request(app)
        .post(`/products/${productId}/images`)
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani')
        .attach('image', Buffer.from('fake-image'), 'test.jpg');

      expect(response.status).toBe(200);
      expect(response.body.data.imageUrl).toBe('http://s3/img.webp');
    });
  });

  describe('PATCH /products/reduce-stock', () => {
    it('should reduce stock successfully', async () => {
      (Product.findOneAndUpdate as jest.Mock).mockResolvedValue({ _id: 'p1' });

      const response = await request(app)
        .patch('/products/reduce-stock')
        .send({
          items: [{ productId: 'p1', quantity: 2 }],
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /products/:id/reviews', () => {
    const productId = '6a03d00c22e9882dac8e0a55';
    const reviewData = {
      rating: 5,
      comment: 'Barang sangat bagus dan segar!',
    };

    it('should create review successfully as buyer', async () => {
      (Product.findById as jest.Mock).mockResolvedValue({ _id: productId });
      (orderServiceClient.checkPurchase as jest.Mock).mockResolvedValue({
        hasPurchased: true,
        orderId: 'order-123',
      });
      (Review.findOne as jest.Mock).mockResolvedValue(null);
      (Review.create as jest.Mock).mockResolvedValue({
        _id: 'rev-1',
        ...reviewData,
        buyer_id: 'buyer-1',
        buyer_name: 'Buyer One',
        product_id: productId,
      });

      const response = await request(app)
        .post(`/products/${productId}/reviews`)
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer')
        .set('X-User-Name', 'Buyer One')
        .send(reviewData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.rating).toBe(reviewData.rating);
      expect(response.body.data.buyer_name).toBe('Buyer One');
    });

    it('should return 422 for invalid rating', async () => {
      const response = await request(app)
        .post(`/products/${productId}/reviews`)
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer')
        .send({ rating: 6, comment: 'Too high' });

      expect(response.status).toBe(422);
    });

    it('should return 403 if not purchased', async () => {
      (Product.findById as jest.Mock).mockResolvedValue({ _id: productId });
      (orderServiceClient.checkPurchase as jest.Mock).mockResolvedValue({ hasPurchased: false });

      const response = await request(app)
        .post(`/products/${productId}/reviews`)
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer')
        .send(reviewData);

      expect(response.status).toBe(403);
    });

    it('should return 409 if already reviewed', async () => {
      (Product.findById as jest.Mock).mockResolvedValue({ _id: productId });
      (orderServiceClient.checkPurchase as jest.Mock).mockResolvedValue({
        hasPurchased: true,
        orderId: 'order-123',
      });
      (Review.findOne as jest.Mock).mockResolvedValue({ _id: 'rev-0' });

      const response = await request(app)
        .post(`/products/${productId}/reviews`)
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer')
        .send(reviewData);

      expect(response.status).toBe(409);
    });
  });

  describe('GET /products/:id/reviews', () => {
    it('should return reviews and metadata for a product', async () => {
      const productId = '6a03d00c22e9882dac8e0a55';
      const mockReviews = [
        { _id: 'rev-1', rating: 5, comment: 'Bagus' },
        { _id: 'rev-2', rating: 4, comment: 'Cukup bagus' },
      ];

      (Review.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue(mockReviews),
          }),
        }),
      });
      (Review.countDocuments as jest.Mock).mockResolvedValue(2);
      (Review.aggregate as jest.Mock).mockResolvedValue([
        { _id: 5, count: 1 },
        { _id: 4, count: 1 },
      ]);

      const response = await request(app).get(`/products/${productId}/reviews`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.meta.average_rating).toBe(4.5);
      expect(response.body.meta.total_reviews).toBe(2);
      expect(response.body.meta.rating_breakdown['5']).toBe(1);
      expect(response.body.meta.rating_breakdown['4']).toBe(1);
    });
  });
});
