import request from 'supertest';
import { app } from './index';
import MessageBroker from './lib/broker';
import Category from './models/category.model';
import { Product } from './models/product.model';
import S3Manager from './lib/s3';

jest.mock('./lib/broker');
jest.mock('./models/category.model');
jest.mock('./models/product.model');
jest.mock('./lib/s3');
jest.mock('./lib/auth-client');
jest.mock('sharp', () => {
  return jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    webp: jest.fn().mockReturnThis(),
    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
  }));
});

describe('Marketplace Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (MessageBroker.connect as jest.Mock).mockResolvedValue(undefined);
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

  it('should return 200 and list of categories', async () => {
    const mockCategories = [{ name: 'Sayuran', slug: 'sayuran' }];
    (Category.find as jest.Mock).mockReturnValue({
      sort: jest.fn().mockResolvedValue(mockCategories),
    });

    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockCategories);
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
        id: 'uuid',
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
        .patch('/products/6a03d00c22e9882dac8e0a55')
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
});
