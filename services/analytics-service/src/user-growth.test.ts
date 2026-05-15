import request from 'supertest';
import express from 'express';
import overviewRoutes from './routes/overview.routes';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import userAnalyticsService from './services/user-analytics.service';

jest.mock('./services/user-analytics.service');

const app = express();
app.use(express.json());
app.use('/analytics', overviewRoutes);
app.use(errorHandlerMiddleware);

describe('GET /analytics/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and user growth data for admin', async () => {
    const mockData = [
      { date: '2026-05-01', petani: 5, buyer: 10 },
      { date: '2026-05-02', petani: 7, buyer: 15 }
    ];

    (userAnalyticsService.getUserGrowth as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app)
      .get('/analytics/users')
      .query({ granularity: 'day' })
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockData);
    expect(userAnalyticsService.getUserGrowth).toHaveBeenCalled();
  });

  it('should return 403 for non-admin user', async () => {
    const res = await request(app)
      .get('/analytics/users')
      .set('X-User-Id', 'user-1')
      .set('X-User-Role', 'buyer');

    expect(res.status).toBe(403);
  });
});
