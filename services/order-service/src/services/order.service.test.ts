import orderService from './order.service';
import cartService from './cart.service';
import marketplaceClient from '../lib/marketplace-client';
import MessageBroker from '../lib/broker';
import { paymentTimeoutQueue, autoCompleteQueue } from '../lib/queue';
import RedisClient from '../lib/redis';
import orderRepository from '../repositories/order.repository';
import prisma from '../lib/prisma';

jest.mock('./cart.service');
jest.mock('../lib/marketplace-client');
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
jest.mock('../lib/broker');
jest.mock('../repositories/order.repository');
jest.mock('../lib/prisma', () => ({
  $transaction: jest.fn().mockImplementation((callback) =>
    callback({
      order: {
        create: jest.fn().mockResolvedValue({ id: 'order-1', total_amount: 1000 }),
      },
    })
  ),
}));

describe('OrderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkout', () => {
    it('should checkout successfully', async () => {
      const mockCart = {
        items: [
          {
            productId: 'p1',
            farmerId: 'f1',
            title: 'Prod 1',
            price_per_unit: 1000,
            quantity: 2,
            subtotal: 2000,
            isAvailable: true,
          },
        ],
        total: 2000,
      };
      (cartService.getCart as jest.Mock).mockResolvedValue(mockCart);
      (marketplaceClient.reduceStock as jest.Mock).mockResolvedValue(true);

      const result = await orderService.checkout('u1', {
        shippingAddress: { province: 'P', city: 'C', full_address: 'Addr 1' },
      });

      expect(cartService.getCart).toHaveBeenCalledWith('u1');
      expect(marketplaceClient.reduceStock).toHaveBeenCalled();
      expect(RedisClient.del).toHaveBeenCalledWith('cart:u1');
      expect(paymentTimeoutQueue.add).toHaveBeenCalledWith(
        'cancel-order',
        { orderId: 'order-1' },
        expect.any(Object)
      );
      expect(result.id).toBe('order-1');
    });
  });

  describe('getOrderById', () => {
    const mockOrderId = '550e8400-e29b-41d4-a716-446655440000';

    it('should return order for buyer owner', async () => {
      const mockOrder = { id: mockOrderId, buyer_id: 'u1', items: [] };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(mockOrderId, 'u1', 'buyer');
      expect(result.id).toBe(mockOrderId);
    });

    it('should throw 403 for buyer non-owner', async () => {
      const mockOrder = { id: mockOrderId, buyer_id: 'u2', items: [] };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await expect(orderService.getOrderById(mockOrderId, 'u1', 'buyer')).rejects.toThrow(
        'Anda tidak memiliki akses'
      );
    });

    it('should return filtered items for petani with items', async () => {
      const mockOrder = {
        id: mockOrderId,
        buyer_id: 'u1',
        items: [
          { farmer_id: 'f1', product_id: 'p1' },
          { farmer_id: 'f2', product_id: 'p2' },
        ],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(mockOrderId, 'f1', 'petani');
      expect(result.items).toHaveLength(1);
      expect(result.items[0].farmer_id).toBe('f1');
    });

    it('should throw 403 for petani without items', async () => {
      const mockOrder = {
        id: mockOrderId,
        buyer_id: 'u1',
        items: [{ farmer_id: 'f2', product_id: 'p2' }],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await expect(orderService.getOrderById(mockOrderId, 'f1', 'petani')).rejects.toThrow(
        'Anda tidak memiliki akses'
      );
    });

    it('should return order for admin', async () => {
      const mockOrder = { id: mockOrderId, buyer_id: 'u2', items: [] };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(mockOrderId, 'admin-id', 'admin');
      expect(result.id).toBe(mockOrderId);
    });

    it('should throw 404 if order not found', async () => {
      (orderRepository.findById as jest.Mock).mockResolvedValue(null);

      await expect(orderService.getOrderById(mockOrderId, 'u1', 'buyer')).rejects.toThrow(
        'Order tidak ditemukan'
      );
    });
  });

  describe('confirmOrder', () => {
    const mockOrderId = '550e8400-e29b-41d4-a716-446655440000';

    it('should confirm order successfully', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        items: [{ farmer_id: 'f1' }],
        buyer_id: 'u2',
        shipping_address: {},
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (orderRepository.updateStatus as jest.Mock).mockResolvedValue({
        ...mockOrder,
        status: 'confirmed_seller',
      });

      const result = await orderService.confirmOrder(mockOrderId, 'f1', 'petani');

      expect(orderRepository.updateStatus).toHaveBeenCalledWith(mockOrderId, 'confirmed_seller');
      expect(result.status).toBe('confirmed_seller');
    });

    it('should throw 400 if order status is not paid', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'pending_payment',
        items: [{ farmer_id: 'f1' }],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await expect(orderService.confirmOrder(mockOrderId, 'f1', 'petani')).rejects.toThrow(
        'Hanya order yang sudah dibayar'
      );
    });

    it('should throw 403 if petani does not own items in order', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        items: [{ farmer_id: 'f2' }],
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await expect(orderService.confirmOrder(mockOrderId, 'f1', 'petani')).rejects.toThrow(
        'Anda tidak memiliki akses'
      );
    });
  });

  describe('deliverOrder', () => {
    const mockOrderId = '550e8400-e29b-41d4-a716-446655440000';

    it('should deliver order successfully', async () => {
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
      (autoCompleteQueue.getJob as jest.Mock).mockResolvedValue({
        remove: mockRemove,
      });
      (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);

      const result = await orderService.deliverOrder(mockOrderId, 'u1', 'buyer');

      expect(orderRepository.completeOrder).toHaveBeenCalledWith(mockOrderId);
      expect(autoCompleteQueue.getJob).toHaveBeenCalledWith(`auto-complete:${mockOrderId}`);
      expect(mockRemove).toHaveBeenCalled();
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'order.delivered',
        expect.objectContaining({
          orderId: mockOrderId,
          buyerId: 'u1',
          totalAmount: 10000,
          completedAt: expect.any(Date),
        })
      );
      expect(result.status).toBe('delivered');
      expect(result.completed_at).toBeInstanceOf(Date);
    });

    it('should still publish event when auto-complete job does not exist', async () => {
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
      (autoCompleteQueue.getJob as jest.Mock).mockResolvedValue(null);
      (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);

      await orderService.deliverOrder(mockOrderId, 'u1', 'buyer');

      expect(autoCompleteQueue.getJob).toHaveBeenCalledWith(`auto-complete:${mockOrderId}`);
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'order.delivered',
        expect.objectContaining({ orderId: mockOrderId })
      );
    });

    it('should throw 400 if order status is not shipped', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        buyer_id: 'u1',
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await expect(orderService.deliverOrder(mockOrderId, 'u1', 'buyer')).rejects.toThrow(
        'Hanya order yang sedang dikirim'
      );
    });

    it('should throw 403 if user is not the owner buyer', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'shipped',
        buyer_id: 'u2',
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await expect(orderService.deliverOrder(mockOrderId, 'u1', 'buyer')).rejects.toThrow(
        'Anda tidak memiliki akses'
      );
    });
  });

  describe('requestRefund', () => {
    const mockOrderId = '550e8400-e29b-41d4-a716-446655440000';
    const mockReason = 'Barang rusak saat sampai';

    it('should request refund successfully', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        buyer_id: 'u1',
        total_amount: 10000,
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (orderRepository.requestRefund as jest.Mock).mockResolvedValue({
        ...mockOrder,
        status: 'refund_requested',
        refund_reason: mockReason,
      });
      (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);

      const result = await orderService.requestRefund(mockOrderId, 'u1', 'buyer', {
        reason: mockReason,
      });

      expect(orderRepository.requestRefund).toHaveBeenCalledWith(mockOrderId, mockReason);
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'order.refund_requested',
        expect.objectContaining({
          orderId: mockOrderId,
          buyerId: 'u1',
          totalAmount: 10000,
          reason: mockReason,
        })
      );
      expect(result.status).toBe('refund_requested');
    });

    it('should throw 400 if order status is not paid or shipped', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'pending_payment',
        buyer_id: 'u1',
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await expect(
        orderService.requestRefund(mockOrderId, 'u1', 'buyer', { reason: mockReason })
      ).rejects.toThrow('Refund hanya bisa diajukan');
    });

    it('should throw 403 if user is not the owner buyer', async () => {
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        buyer_id: 'u2',
      };
      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await expect(
        orderService.requestRefund(mockOrderId, 'u1', 'buyer', { reason: mockReason })
      ).rejects.toThrow('Anda tidak memiliki akses');
    });
  });
});
