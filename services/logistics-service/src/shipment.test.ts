import request from 'supertest';
import express from 'express';
import shipmentRoutes from './routes/shipment.routes';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import shipmentService from './services/shipment.service';

jest.mock('./services/shipment.service');

// Mock env
jest.mock('./config/env', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3005,
    MONGODB_URL: 'mongodb://localhost:27017/test',
    REDIS_URL: 'redis://localhost:6379',
    RABBITMQ_URL: 'amqp://localhost',
  },
}));

const app = express();
app.use(express.json());
app.use('/shipments', shipmentRoutes);
app.use(errorHandlerMiddleware);

describe('GET /shipments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return shipments for logistik', async () => {
    (shipmentService.getShipments as jest.Mock).mockResolvedValue({
      data: [{ id: 'ship-1', order_id: 'order-1', logistic_id: 'logistik-1', status: 'pending_pickup' }],
      meta: { total: 1, page: 1, limit: 20, total_pages: 1 },
    });

    const res = await request(app)
      .get('/shipments')
      .set('X-User-Id', 'logistik-1')
      .set('X-User-Role', 'logistik');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
    expect(shipmentService.getShipments).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'logistik-1', role: 'logistik' }),
      expect.objectContaining({ page: 1, limit: 20 })
    );
  });

  it('should return 403 if user is not logistik or admin', async () => {
    const res = await request(app)
      .get('/shipments')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani');

    expect(res.status).toBe(403);
    expect(shipmentService.getShipments).not.toHaveBeenCalled();
  });
});

describe('GET /shipments/:order_id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return shipment tracking history', async () => {
    const mockShipment = {
      order_id: 'order-123',
      status: 'pending_pickup',
      status_history: [
        { status: 'pending_pickup', notes: 'Waiting for pickup', timestamp: new Date('2026-05-14T10:00:00Z') }
      ]
    };

    (shipmentService.getShipmentByOrderId as jest.Mock).mockResolvedValue(mockShipment);

    const res = await request(app).get('/shipments/order-123');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.order_id).toBe('order-123');
    expect(res.body.data.status_history).toHaveLength(1);
  });

  it('should return 404 if shipment not found', async () => {
    (shipmentService.getShipmentByOrderId as jest.Mock).mockRejectedValue({
      statusCode: 404,
      code: 'NOT_FOUND',
      message: 'Shipment tidak ditemukan'
    });

    const res = await request(app).get('/shipments/non-existent');

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe('PATCH /shipments/:order_id/pickup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should confirm pickup and return 200', async () => {
    (shipmentService.pickupShipment as jest.Mock).mockResolvedValue({
      order_id: 'order-123',
      status: 'picked_up',
      picked_up_at: new Date()
    });

    const res = await request(app)
      .patch('/shipments/order-123/pickup')
      .set('X-User-Id', 'logistik-1')
      .set('X-User-Role', 'logistik');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('picked_up');
  });

  it('should return 403 if logistik is not assigned', async () => {
    (shipmentService.pickupShipment as jest.Mock).mockRejectedValue({
      statusCode: 403,
      code: 'FORBIDDEN',
      message: 'Anda tidak memiliki akses ke shipment ini'
    });

    const res = await request(app)
      .patch('/shipments/order-123/pickup')
      .set('X-User-Id', 'logistik-wrong')
      .set('X-User-Role', 'logistik');

    expect(res.status).toBe(403);
  });
});

describe('PATCH /shipments/:order_id/transit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update status to in_transit and return 200', async () => {
    (shipmentService.transitShipment as jest.Mock).mockResolvedValue({
      order_id: 'order-123',
      status: 'in_transit'
    });

    const res = await request(app)
      .patch('/shipments/order-123/transit')
      .set('X-User-Id', 'logistik-1')
      .set('X-User-Role', 'logistik')
      .send({ notes: 'Sedang dikirim ke hub Bandung' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('in_transit');
  });

  it('should return 400 if shipment is not picked_up', async () => {
    (shipmentService.transitShipment as jest.Mock).mockRejectedValue({
      statusCode: 400,
      code: 'LOGISTICS_002',
      message: 'Shipment harus sudah diambil (picked_up) sebelum dikirim'
    });

    const res = await request(app)
      .patch('/shipments/order-123/transit')
      .set('X-User-Id', 'logistik-1')
      .set('X-User-Role', 'logistik');

    expect(res.status).toBe(400);
  });
});

describe('PATCH /shipments/:order_id/deliver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update status to delivered and return 200', async () => {
    (shipmentService.deliverShipment as jest.Mock).mockResolvedValue({
      order_id: 'order-123',
      status: 'delivered',
      delivered_at: new Date()
    });

    const res = await request(app)
      .patch('/shipments/order-123/deliver')
      .set('X-User-Id', 'logistik-1')
      .set('X-User-Role', 'logistik');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('delivered');
  });

  it('should return 400 if shipment is not in_transit', async () => {
    (shipmentService.deliverShipment as jest.Mock).mockRejectedValue({
      statusCode: 400,
      code: 'LOGISTICS_003',
      message: 'Shipment harus dalam status in_transit sebelum delivered'
    });

    const res = await request(app)
      .patch('/shipments/order-123/deliver')
      .set('X-User-Id', 'logistik-1')
      .set('X-User-Role', 'logistik');

    expect(res.status).toBe(400);
  });
});
