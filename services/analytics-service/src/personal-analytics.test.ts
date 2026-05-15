import request from 'supertest';
import express from 'express';
import overviewRoutes from './routes/overview.routes';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import personalAnalyticsService from './services/personal-analytics.service';

jest.mock('./services/personal-analytics.service');

const app = express();
app.use(express.json());
app.use('/analytics', overviewRoutes);
app.use(errorHandlerMiddleware);

describe('Personal Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /analytics/farmer/:id', () => {
    it('should return 200 for farmer accessing own data', async () => {
      const mockData = { total_sales: 5000000, total_orders: 10, top_products: [] };
      (personalAnalyticsService.getFarmerAnalytics as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app)
        .get('/analytics/farmer/farmer-1')
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockData);
    });

    it('should return 403 for farmer accessing other data', async () => {
      const res = await request(app)
        .get('/analytics/farmer/farmer-2')
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani');

      expect(res.status).toBe(403);
    });

    it('should return 200 for admin accessing any farmer data', async () => {
      const mockData = { total_sales: 5000000, total_orders: 10, top_products: [] };
      (personalAnalyticsService.getFarmerAnalytics as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app)
        .get('/analytics/farmer/farmer-2')
        .set('X-User-Id', 'admin-1')
        .set('X-User-Role', 'admin');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /analytics/investor/:id', () => {
    it('should return 200 for investor accessing own data', async () => {
      const mockData = { total_invested: 10000000, total_projected_return: 11500000 };
      (personalAnalyticsService.getInvestorAnalytics as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app)
        .get('/analytics/investor/investor-1')
        .set('X-User-Id', 'investor-1')
        .set('X-User-Role', 'investor');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockData);
    });
  });
});
