import request from 'supertest';
import express from 'express';
import overviewRoutes from './routes/overview.routes';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import overviewService from './services/overview.service';

jest.mock('./services/overview.service');

const app = express();
app.use(express.json());
app.use('/analytics', overviewRoutes);
app.use(errorHandlerMiddleware);

describe('GET /analytics/overview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and overview data for admin', async () => {
    const mockData = {
      total_gmv: 10000000,
      today_gmv: 1000000,
      active_users: 50,
      today_orders: 5,
      disbursed_investment: 20000000,
      order_breakdown: { completed: 10, pending: 2 }
    };

    (overviewService.getOverview as jest.Mock).mockResolvedValue(mockData);

    const res = await request(app)
      .get('/analytics/overview')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(mockData);
    expect(overviewService.getOverview).toHaveBeenCalled();
  });

  it('should return 403 for non-admin user', async () => {
    const res = await request(app)
      .get('/analytics/overview')
      .set('X-User-Id', 'user-1')
      .set('X-User-Role', 'buyer');

    expect(res.status).toBe(403);
    expect(overviewService.getOverview).not.toHaveBeenCalled();
  });

  it('should return 401 for unauthenticated user', async () => {
    const res = await request(app).get('/analytics/overview');
    expect(res.status).toBe(401);
  });
});
