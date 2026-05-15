import request from 'supertest';
import express from 'express';
import { correlationIdMiddleware } from '../../../shared/middleware/correlationId';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';

const app = express();
app.use(express.json());
app.use(correlationIdMiddleware);

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Analytics Service is healthy' });
});

app.use(errorHandlerMiddleware);

describe('GET /health', () => {
  it('should return 200 and healthy message', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Analytics Service is healthy');
  });
});
