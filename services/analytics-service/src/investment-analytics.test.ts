import request from 'supertest';
import express from 'express';
import overviewRoutes from './routes/overview.routes';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import investmentAnalyticsService from './services/investment-analytics.service';

jest.mock('./services/investment-analytics.service');

const app = express();
app.use(express.json());
app.use('/analytics', overviewRoutes);
app.use(errorHandlerMiddleware);

describe('GET /analytics/investments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and investment analytics data for admin', async () => {
    const mockData = {
      total_disbursed: 50000000,
      active_proposals: 5,
      completed_proposals: 2,
      average_roi: 12.5
    };

    (investmentAnalyticsService.getInvestmentAnalytics as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app)
      .get('/analytics/investments')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockData);
    expect(investmentAnalyticsService.getInvestmentAnalytics).toHaveBeenCalled();
  });

  it('should return 403 for non-admin user', async () => {
    const res = await request(app)
      .get('/analytics/investments')
      .set('X-User-Id', 'user-1')
      .set('X-User-Role', 'buyer');

    expect(res.status).toBe(403);
  });
});
