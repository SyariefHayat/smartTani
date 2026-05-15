import request from 'supertest';
import express from 'express';
import overviewRoutes from './routes/overview.routes';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import orderAnalyticsService from './services/order-analytics.service';

jest.mock('./services/order-analytics.service');

const app = express();
app.use(express.json());
app.use('/analytics', overviewRoutes);
app.use(errorHandlerMiddleware);

describe('GET /analytics/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and order analytics data for admin', async () => {
    const mockData = [
      { date: '2026-05-01', volume: 10, value: 5000000 },
      { date: '2026-05-02', volume: 15, value: 7500000 }
    ];

    (orderAnalyticsService.getOrderAnalytics as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app)
      .get('/analytics/orders')
      .query({ granularity: 'day' })
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockData);
    expect(orderAnalyticsService.getOrderAnalytics).toHaveBeenCalled();
  });

  it('should return 403 for non-admin user', async () => {
    const res = await request(app)
      .get('/analytics/orders')
      .set('X-User-Id', 'user-1')
      .set('X-User-Role', 'buyer');

    expect(res.status).toBe(403);
  });
});
