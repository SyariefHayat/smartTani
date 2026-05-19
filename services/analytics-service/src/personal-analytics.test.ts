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
      const mockData = {
        total_revenue: 5000000,
        total_orders: 10,
        total_products: 5,
        pending_orders: 2,
        monthly_revenue: 1000000,
        prev_month_revenue: 800000,
        revenue_change_percent: 25,
        top_products: [],
      };
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
      const mockData = {
        total_revenue: 5000000,
        total_orders: 10,
        total_products: 5,
        pending_orders: 2,
        monthly_revenue: 1000000,
        prev_month_revenue: 800000,
        revenue_change_percent: 25,
        top_products: [],
      };
      (personalAnalyticsService.getFarmerAnalytics as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app)
        .get('/analytics/farmer/farmer-2')
        .set('X-User-Id', 'admin-1')
        .set('X-User-Role', 'admin');

      expect(res.status).toBe(200);
    });
  });

  describe('GET /analytics/farmer/:id/revenue-chart', () => {
    it('should return 200 for farmer accessing own chart data', async () => {
      const mockData = [
        { date: '2026-05-01', pendapatan: 1000000, pengeluaran: 20000 },
        { date: '2026-05-02', pendapatan: 1500000, pengeluaran: 30000 },
      ];
      (personalAnalyticsService.getFarmerRevenueChart as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app)
        .get('/analytics/farmer/farmer-1/revenue-chart')
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockData);
    });

    it('should return 403 for farmer accessing other chart data', async () => {
      const res = await request(app)
        .get('/analytics/farmer/farmer-2/revenue-chart')
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani');

      expect(res.status).toBe(403);
    });

    it('should return 200 for admin accessing any farmer chart data', async () => {
      const mockData = [{ date: '2026-05-01', pendapatan: 1000000, pengeluaran: 20000 }];
      (personalAnalyticsService.getFarmerRevenueChart as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app)
        .get('/analytics/farmer/farmer-2/revenue-chart')
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
