import request from 'supertest';
import { app } from './index';
import MessageBroker from './lib/broker';
import Category from './models/category.model';
import { Product } from './models/product.model';

jest.mock('./lib/broker');
jest.mock('./models/category.model');
jest.mock('./models/product.model');

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
});
