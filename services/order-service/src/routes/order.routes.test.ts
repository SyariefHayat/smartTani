import request from 'supertest';
import { app } from '../index';
import MessageBroker from '../lib/broker';
import { autoCompleteQueue } from '../lib/queue';
import orderRepository from '../repositories/order.repository';

jest.mock('../repositories/order.repository');
jest.mock('../lib/broker');
jest.mock('../lib/queue', () => ({
  paymentTimeoutQueue: {
    add: jest.fn(),
    getJob: jest.fn(),
  },
  autoCompleteQueue: {
    add: jest.fn(),
    getJob: jest.fn(),
  },
}));
jest.mock('../lib/redis');

describe('Order Routes', () => {
  const mockOrderId = '550e8400-e29b-41d4-a716-446655440000';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /orders', () => {
    it('should return 200 and list of orders for buyer', async () => {
      const mockOrders = [{ id: mockOrderId, buyer_id: 'u1', total_amount: 10000, items: [] }];
      (orderRepository.findAll as jest.Mock).mockResolvedValue({ orders: mockOrders, total: 1 });

      const response = await request(app)
        .get('/orders')
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.orders).toHaveLength(1);
      expect(orderRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'u1', role: 'buyer' })
      );
    });

    it('should return 200 and list of orders for petani containing their products', async () => {
      const mockOrders = [
        { id: mockOrderId, buyer_id: 'u2', total_amount: 20000, items: [{ farmer_id: 'f1' }] },
      ];
      (orderRepository.findAll as jest.Mock).mockResolvedValue({ orders: mockOrders, total: 1 });

      const response = await request(app)
        .get('/orders')
        .set('X-User-Id', 'f1')
        .set('X-User-Role', 'petani');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(orderRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'f1', role: 'petani' })
      );
    });
  });

  describe('GET /orders/:id', () => {
    it('should return 200 and order detail for owner buyer', async () => {
      const mockOrder = { id: mockOrderId, buyer_id: 'u1', items: [] };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .get(`/orders/${mockOrderId}`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(200);
      expect(response.body.data.id).toBe(mockOrderId);
    });

    it('should return 200 and filtered items for petani', async () => {
      const mockOrder = {
        id: mockOrderId,
        buyer_id: 'u2',
        items: [
          { farmer_id: 'f1', product_id: 'p1' },
          { farmer_id: 'f2', product_id: 'p2' },
        ],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .get(`/orders/${mockOrderId}`)
        .set('X-User-Id', 'f1')
        .set('X-User-Role', 'petani');

      expect(response.status).toBe(200);
      expect(response.body.data.items).toHaveLength(1);
      expect(response.body.data.items[0].farmer_id).toBe('f1');
    });

    it('should return 400 for invalid UUID', async () => {
      const response = await request(app)
        .get('/orders/invalid-id')
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should return 403 if user has no access', async () => {
      const mockOrder = { id: mockOrderId, buyer_id: 'u2', items: [] };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .get(`/orders/${mockOrderId}`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(403);
    });

    it('should return 404 if order not found', async () => {
      (orderRepository.findById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .get(`/orders/${mockOrderId}`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /orders/:id/confirm', () => {
    it('should return 200 and confirmed order for petani who has items', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        items: [{ farmer_id: 'f1' }],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (orderRepository.updateStatus as jest.Mock).mockResolvedValue({
        ...mockOrder,
        status: 'confirmed_seller',
      });

      const response = await request(app)
        .patch(`/orders/${mockOrderId}/confirm`)
        .set('X-User-Id', 'f1')
        .set('X-User-Role', 'petani');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('confirmed_seller');
    });

    it('should return 400 if order is not paid', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'pending_payment',
        items: [{ farmer_id: 'f1' }],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .patch(`/orders/${mockOrderId}/confirm`)
        .set('X-User-Id', 'f1')
        .set('X-User-Role', 'petani');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Hanya order yang sudah dibayar');
    });

    it('should return 403 if petani does not have items in order', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        items: [{ farmer_id: 'f2' }],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .patch(`/orders/${mockOrderId}/confirm`)
        .set('X-User-Id', 'f1')
        .set('X-User-Role', 'petani');

      expect(response.status).toBe(403);
    });
  });

  describe('PATCH /orders/:id/deliver', () => {
    it('should return 200 and delivered order for buyer owner', async () => {
      const mockRemove = jest.fn().mockResolvedValue(undefined);
      const mockOrder = {
        id: mockOrderId,
        status: 'shipped',
        buyer_id: 'u1',
        total_amount: 10000,
        items: [],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (orderRepository.completeOrder as jest.Mock).mockResolvedValue({
        ...mockOrder,
        status: 'delivered',
        completed_at: new Date('2026-05-13T13:00:00.000Z'),
      });
      (autoCompleteQueue.getJob as jest.Mock).mockResolvedValue({ remove: mockRemove });
      (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .patch(`/orders/${mockOrderId}/deliver`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('delivered');
      expect(autoCompleteQueue.getJob).toHaveBeenCalledWith(`auto-complete:${mockOrderId}`);
      expect(mockRemove).toHaveBeenCalled();
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'order.delivered',
        expect.objectContaining({
          orderId: mockOrderId,
          buyerId: 'u1',
          completedAt: expect.any(Date),
        })
      );
    });

    it('should return 400 if order is not shipped', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        buyer_id: 'u1',
        items: [],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .patch(`/orders/${mockOrderId}/deliver`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(400);
      expect(response.body.error.message).toContain('Hanya order yang sedang dikirim');
    });

    it('should return 403 if user is not the owner buyer', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'shipped',
        buyer_id: 'u2',
        items: [],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .patch(`/orders/${mockOrderId}/deliver`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(403);
    });
  });

  describe('POST /orders/:id/refund', () => {
    it('should return 200 and refund requested order for buyer owner', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        buyer_id: 'u1',
        total_amount: 10000,
        items: [],
      };
      const mockReason = 'Barang rusak saat sampai';
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (orderRepository.requestRefund as jest.Mock).mockResolvedValue({
        ...mockOrder,
        status: 'refund_requested',
        refund_reason: mockReason,
      });
      (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);

      const response = await request(app)
        .post(`/orders/${mockOrderId}/refund`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer')
        .send({ reason: mockReason });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe('refund_requested');
      expect(orderRepository.requestRefund).toHaveBeenCalledWith(mockOrderId, mockReason);
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'order.refund_requested',
        expect.objectContaining({ orderId: mockOrderId, reason: mockReason })
      );
    });

    it('should return 422 for invalid request body', async () => {
      const response = await request(app)
        .post(`/orders/${mockOrderId}/refund`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer')
        .send({ reason: 'short' });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.error.message).toContain('Alasan refund minimal 10 karakter');
    });

    it('should return 403 if user is not the owner buyer', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        buyer_id: 'u2',
        items: [],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const response = await request(app)
        .post(`/orders/${mockOrderId}/refund`)
        .set('X-User-Id', 'u1')
        .set('X-User-Role', 'buyer')
        .send({ reason: 'Barang rusak saat sampai' });

      expect(response.status).toBe(403);
    });
  });
});
