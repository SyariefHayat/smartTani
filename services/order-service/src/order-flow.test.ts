import request from 'supertest';
import { app } from './index';
import orderRepository from './repositories/order.repository';
import cartService from './services/cart.service';
import marketplaceClient from './lib/marketplace-client';
import MessageBroker from './lib/broker';
import { paymentTimeoutQueue, autoCompleteQueue } from './lib/queue';
import * as verifyUtils from './lib/midtrans-verify';
import prisma from './lib/prisma';

jest.mock('./repositories/order.repository');
jest.mock('./services/cart.service');
jest.mock('./lib/marketplace-client');
jest.mock('./lib/broker');
jest.mock('./lib/midtrans-verify');
jest.mock('./lib/queue', () => ({
  paymentTimeoutQueue: {
    add: jest.fn(),
    getJob: jest.fn(),
  },
  autoCompleteQueue: {
    add: jest.fn(),
    getJob: jest.fn(),
  },
}));
jest.mock('./lib/prisma', () => ({
  order: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $transaction: jest.fn().mockImplementation((callback) =>
    callback({
      order: {
        create: jest.fn().mockResolvedValue({
          id: '123e4567-e89b-12d3-a456-426614174000',
          buyer_id: 'buyer-1',
          total_amount: 117000,
          status: 'pending_payment',
          items: [
            {
              product_id: 'p1',
              farmer_id: 'f1',
              quantity: 2,
              price_per_unit: 50000,
              subtotal: 100000,
            },
          ],
        }),
      },
    })
  ),
}));

describe('Order Flow Integration Tests', () => {
  const mockOrderId = '123e4567-e89b-12d3-a456-426614174000';

  beforeEach(() => {
    jest.clearAllMocks();
    (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);
    (marketplaceClient.restoreStock as jest.Mock).mockResolvedValue(true);
  });

  describe('Full Flow: Checkout -> Payment -> Confirm -> Deliver', () => {
    it('should complete the full order lifecycle', async () => {
      // 1. Checkout
      (cartService.getCart as jest.Mock).mockResolvedValue({
        items: [
          {
            productId: 'p1',
            farmerId: 'f1',
            title: 'Product 1',
            price_per_unit: 50000,
            quantity: 2,
            subtotal: 100000,
            isAvailable: true,
          },
        ],
        total: 100000,
      });
      (marketplaceClient.reduceStock as jest.Mock).mockResolvedValue(true);

      const checkoutRes = await request(app)
        .post('/orders')
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer')
        .send({
          shippingAddress: { 
            province: 'Jawa Barat', 
            city: 'Bandung', 
            full_address: 'Jl. Merdeka No. 123, Bandung' 
          },
          notes: 'Test order',
        });

      expect(checkoutRes.status).toBe(201);

      // 2. Payment Webhook
      (verifyUtils.verifyMidtransSignature as jest.Mock).mockReturnValue(true);
      (prisma.order.findUnique as jest.Mock).mockResolvedValue({
        id: mockOrderId,
        status: 'pending_payment',
        buyer_id: 'buyer-1',
        total_amount: 117000,
        items: [
          { product_id: 'p1', quantity: 2, price_per_unit: 50000 }
        ],
      });
      (prisma.order.update as jest.Mock).mockResolvedValue({
        id: mockOrderId,
        status: 'paid',
        items: [],
      });
      (paymentTimeoutQueue.getJob as jest.Mock).mockResolvedValue({ remove: jest.fn() });

      const webhookRes = await request(app).post('/payments/webhook').send({
        order_id: mockOrderId,
        status_code: '200',
        gross_amount: '117000.00',
        signature_key: 'valid',
        transaction_status: 'settlement',
      });

      expect(webhookRes.status).toBe(200);

      // 3. Confirm Order (Petani)
      (orderRepository.findById as jest.Mock).mockResolvedValue({
        id: mockOrderId,
        status: 'paid',
        buyer_id: 'buyer-1',
        items: [{ farmer_id: 'f1' }],
      });
      (orderRepository.updateStatus as jest.Mock).mockResolvedValue({
        id: mockOrderId,
        status: 'confirmed_seller',
        items: [],
      });

      const confirmRes = await request(app)
        .patch(`/orders/${mockOrderId}/confirm`)
        .set('X-User-Id', 'f1')
        .set('X-User-Role', 'petani');

      expect(confirmRes.status).toBe(200);
      expect(confirmRes.body.data.status).toBe('confirmed_seller');

      // 4. Deliver Order (Buyer)
      (orderRepository.findById as jest.Mock).mockResolvedValue({
        id: mockOrderId,
        status: 'shipped',
        buyer_id: 'buyer-1',
        items: [],
      });
      (orderRepository.completeOrder as jest.Mock).mockResolvedValue({
        id: mockOrderId,
        status: 'delivered',
        completed_at: new Date(),
        items: [],
      });
      (autoCompleteQueue.getJob as jest.Mock).mockResolvedValue({ remove: jest.fn() });

      const deliverRes = await request(app)
        .patch(`/orders/${mockOrderId}/deliver`)
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer');

      expect(deliverRes.status).toBe(200);
      expect(deliverRes.body.data.status).toBe('delivered');
    });
  });

  describe('Stock Conflict', () => {
    it('should return 409 if stock reduction fails', async () => {
      (cartService.getCart as jest.Mock).mockResolvedValue({
        items: [{ isAvailable: true, productId: 'p1', quantity: 2, farmerId: 'f1' }],
        total: 100000,
      });
      (marketplaceClient.reduceStock as jest.Mock).mockResolvedValue(false);

      const response = await request(app)
        .post('/orders')
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer')
        .send({
          shippingAddress: { 
            province: 'Jawa Barat', 
            city: 'Bandung', 
            full_address: 'Jl. Merdeka No. 123, Bandung' 
          },
        });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('MARKET_008');
    });
  });

  describe('RBAC: Buyer cannot confirm order', () => {
    it('should return 403 if buyer tries to confirm', async () => {
      const response = await request(app)
        .patch(`/orders/${mockOrderId}/confirm`)
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer');

      expect(response.status).toBe(403);
    });
  });

  describe('Webhook: Invalid Signature', () => {
    it('should return 400 for invalid signature', async () => {
      (verifyUtils.verifyMidtransSignature as jest.Mock).mockReturnValue(false);

      const response = await request(app).post('/payments/webhook').send({
        order_id: mockOrderId,
        signature_key: 'wrong',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.message).toBe('Invalid signature');
    });
  });

  describe('Order Timeout Scheduling', () => {
    let paymentWorkerHandler: any;

    beforeAll(() => {
      const { Worker } = require('bullmq');
      (Worker as unknown as jest.Mock).mockImplementation((name: string, handler: any) => {
        if (name === 'payment-timeout-queue') {
          paymentWorkerHandler = handler;
        }
        return { on: jest.fn() };
      });
      const { initWorkers } = require('./jobs');
      initWorkers();
    });

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should schedule cancellation job and auto cancel after 15 minutes', async () => {
      (cartService.getCart as jest.Mock).mockResolvedValue({
        items: [{ isAvailable: true, productId: 'p1', quantity: 1, farmerId: 'f1', price_per_unit: 50000, subtotal: 50000 }],
        total: 50000,
      });
      (marketplaceClient.reduceStock as jest.Mock).mockResolvedValue(true);

      // Mock queue add to use setTimeout so fake timers can trigger it
      (paymentTimeoutQueue.add as jest.Mock).mockImplementation((name, data, opts) => {
        setTimeout(() => {
          paymentWorkerHandler({ data } as any);
        }, opts.delay);
      });

      // Mock the repository to return the order for the worker
      (orderRepository.findById as jest.Mock).mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'pending_payment',
        buyer_id: 'buyer-1',
        items: [{ product_id: 'p1', quantity: 1, price_per_unit: 50000, subtotal: 50000 }],
      });
      (marketplaceClient.restoreStock as jest.Mock).mockResolvedValue(true);

      const response = await request(app)
        .post('/orders')
        .set('X-User-Id', 'buyer-1')
        .set('X-User-Role', 'buyer')
        .send({
          shippingAddress: { 
            province: 'Jawa Barat', 
            city: 'Bandung', 
            full_address: 'Jl. Merdeka No. 123, Bandung' 
          },
        });

      expect(response.status).toBe(201);
      expect(paymentTimeoutQueue.add).toHaveBeenCalledWith(
        'cancel-order',
        expect.objectContaining({ orderId: expect.any(String) }),
        expect.objectContaining({ delay: 15 * 60 * 1000 })
      );

      // Advance time by 15 minutes
      jest.advanceTimersByTime(15 * 60 * 1000);

      // Wait for promises to resolve inside the setTimeout/worker
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      // Verify worker cancelled the order
      expect(orderRepository.findById).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(orderRepository.updateStatus).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', 'cancelled');
      expect(marketplaceClient.restoreStock).toHaveBeenCalledWith([
        { productId: 'p1', quantity: 1 }
      ]);
    });
  });
});
