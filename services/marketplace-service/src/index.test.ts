import request from 'supertest';
import { app } from './index';
import MessageBroker from './lib/broker';
import Category from './models/category.model';

jest.mock('./lib/broker');
jest.mock('./models/category.model');

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
});
