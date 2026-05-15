import { Job } from 'bullmq';
import { initWorkers } from './index';
import orderRepository from '../repositories/order.repository';
import marketplaceClient from '../lib/marketplace-client';
import MessageBroker from '../lib/broker';
import { Worker } from 'bullmq';

jest.mock('bullmq');
jest.mock('../repositories/order.repository');
jest.mock('../lib/marketplace-client');
jest.mock('../lib/broker');

describe('Payment Timeout Worker', () => {
  let paymentWorkerHandler: (job: Job) => Promise<void>;
  let completionWorkerHandler: (job: Job) => Promise<void>;

  beforeEach(() => {
    jest.clearAllMocks();
    (Worker as unknown as jest.Mock).mockImplementation((name, handler) => {
      if (name === 'payment-timeout-queue') {
        paymentWorkerHandler = handler;
      } else if (name === 'auto-complete-queue') {
        completionWorkerHandler = handler;
      }
      return { on: jest.fn() };
    });
  });

  describe('Payment Timeout Logic', () => {
    it('should cancel order and restore stock when status is pending_payment', async () => {
      initWorkers();

      const mockOrderId = 'order-123';
      const mockOrder = {
        id: mockOrderId,
        status: 'pending_payment',
        buyer_id: 'buyer-456',
        items: [
          { product_id: 'p1', quantity: 2 },
          { product_id: 'p2', quantity: 1 },
        ],
      };

      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (marketplaceClient.restoreStock as jest.Mock).mockResolvedValue(true);
      (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);

      await paymentWorkerHandler({ data: { orderId: mockOrderId } } as Job);

      expect(orderRepository.findById).toHaveBeenCalledWith(mockOrderId);
      expect(orderRepository.updateStatus).toHaveBeenCalledWith(mockOrderId, 'cancelled');
      expect(marketplaceClient.restoreStock).toHaveBeenCalledWith([
        { productId: 'p1', quantity: 2 },
        { productId: 'p2', quantity: 1 },
      ]);
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'order.cancelled',
        expect.objectContaining({ orderId: mockOrderId, reason: 'Payment timeout' })
      );
    });

    it('should skip cancellation if status is not pending_payment', async () => {
      initWorkers();

      const mockOrderId = 'order-123';
      const mockOrder = {
        id: mockOrderId,
        status: 'paid',
        buyer_id: 'buyer-456',
        items: [],
      };

      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await paymentWorkerHandler({ data: { orderId: mockOrderId } } as Job);

      expect(orderRepository.findById).toHaveBeenCalledWith(mockOrderId);
      expect(orderRepository.updateStatus).not.toHaveBeenCalled();
      expect(marketplaceClient.restoreStock).not.toHaveBeenCalled();
      expect(MessageBroker.publish).not.toHaveBeenCalled();
    });

    it('should skip if order not found', async () => {
      initWorkers();

      const mockOrderId = 'order-999';
      (orderRepository.findById as jest.Mock).mockResolvedValue(null);

      await paymentWorkerHandler({ data: { orderId: mockOrderId } } as Job);

      expect(orderRepository.findById).toHaveBeenCalledWith(mockOrderId);
      expect(orderRepository.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('Auto Complete Logic', () => {
    const mockOrderId = 'order-789';

    it('should complete order when status is shipped', async () => {
      initWorkers();

      const mockOrder = {
        id: mockOrderId,
        status: 'shipped',
        buyer_id: 'buyer-111',
        total_amount: 50000,
        items: [],
      };
      const mockCompletedOrder = {
        ...mockOrder,
        status: 'delivered',
        completed_at: new Date(),
      };

      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);
      (orderRepository.completeOrder as jest.Mock).mockResolvedValue(mockCompletedOrder);
      (MessageBroker.publish as jest.Mock).mockResolvedValue(undefined);

      await completionWorkerHandler({ data: { orderId: mockOrderId } } as Job);

      expect(orderRepository.findById).toHaveBeenCalledWith(mockOrderId);
      expect(orderRepository.completeOrder).toHaveBeenCalledWith(mockOrderId);
      expect(MessageBroker.publish).toHaveBeenCalledWith(
        'smarttani.events',
        'order.delivered',
        expect.objectContaining({ orderId: mockOrderId })
      );
    });

    it('should skip if status is not shipped', async () => {
      initWorkers();

      const mockOrder = {
        id: mockOrderId,
        status: 'delivered',
        items: [],
      };

      (orderRepository.findById as jest.Mock).mockResolvedValue(mockOrder);

      await completionWorkerHandler({ data: { orderId: mockOrderId } } as Job);

      expect(orderRepository.findById).toHaveBeenCalledWith(mockOrderId);
      expect(orderRepository.completeOrder).not.toHaveBeenCalled();
    });

    it('should skip if order not found', async () => {
      initWorkers();

      (orderRepository.findById as jest.Mock).mockResolvedValue(null);

      await completionWorkerHandler({ data: { orderId: mockOrderId } } as Job);

      expect(orderRepository.findById).toHaveBeenCalledWith(mockOrderId);
      expect(orderRepository.completeOrder).not.toHaveBeenCalled();
    });
  });
});
