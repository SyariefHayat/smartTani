import request from 'supertest';
import { app } from './index';
import MessageBroker from './lib/broker';
import cartService from './services/cart.service';

jest.mock('./lib/broker');
jest.mock('./services/cart.service');

describe('Order Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (MessageBroker.connect as jest.Mock).mockResolvedValue(undefined);
  });

  it('should return 200 for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.dependencies).toEqual({
      postgres: 'ok',
      redis: 'ok',
    });
  });

  describe('POST /cart/items', () => {
    it('should add item to cart', async () => {
      (cartService.addToCart as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .post('/cart/items')
        .set('X-User-Id', 'user-1')
        .set('X-User-Role', 'buyer')
        .send({ productId: 'p1', quantity: 1 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 403 for unauthorized role (petani)', async () => {
      const response = await request(app)
        .post('/cart/items')
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani')
        .send({ productId: 'p1', quantity: 1 });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /cart', () => {
    it('should return cart successfully', async () => {
      (cartService.getCart as jest.Mock).mockResolvedValue([]);

      const response = await request(app)
        .get('/cart')
        .set('X-User-Id', 'user-1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
