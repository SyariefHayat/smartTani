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

describe('Farmer Finance Analytics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /analytics/farmer/:id/finance', () => {
    it('should return 200 for farmer accessing own finance data', async () => {
      const mockData = {
        current_balance: 8500000,
        total_earnings: 24500000,
        pending_balance: 1200000,
        earnings_change_percent: 3.6,
        transactions: [
          {
            id: 'item-1-rev',
            date: new Date().toISOString(),
            type: 'revenue',
            amount: 1250000,
            description: 'Penjualan Produk A',
            order_id: 'order-1',
          },
        ],
        meta: { page: 1, limit: 20, total: 45 },
      };
      (personalAnalyticsService.getFarmerFinance as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app)
        .get('/analytics/farmer/farmer-1/finance')
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani');

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual(mockData);
    });

    it('should return 403 for farmer accessing other finance data', async () => {
      const res = await request(app)
        .get('/analytics/farmer/farmer-2/finance')
        .set('X-User-Id', 'farmer-1')
        .set('X-User-Role', 'petani');

      expect(res.status).toBe(403);
    });

    it('should return 200 for admin accessing any farmer finance data', async () => {
      const mockData = { current_balance: 10000 };
      (personalAnalyticsService.getFarmerFinance as jest.Mock).mockResolvedValue(mockData);

      const res = await request(app)
        .get('/analytics/farmer/farmer-2/finance')
        .set('X-User-Id', 'admin-1')
        .set('X-User-Role', 'admin');

      expect(res.status).toBe(200);
    });
  });
});
