import { logger } from '../../../../shared/utils/logger';
import MessageBroker from '../lib/broker';
import { BROKER_EXCHANGES, BROKER_QUEUES, BROKER_ROUTING_KEYS } from '../../../../shared/constants/broker';
import shipmentService from '../services/shipment.service';

export const initEvents = async () => {
  try {
    // Ensure exchange exists
    await MessageBroker.createExchange(BROKER_EXCHANGES.EVENTS, 'topic');

    // Subscribe to order.confirmed
    const queue = BROKER_QUEUES.LOGISTICS;
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_CONFIRMED);
    
    await MessageBroker.subscribe(queue, async (payload: any) => {
      logger.info('📦 Received order.confirmed event:', payload.orderId);
      await shipmentService.createShipment({
        orderId: payload.orderId,
      });
    });

    // Bind queue to exchange with routing key
    // Note: MessageBroker.subscribe should probably handle binding too, 
    // but looking at its implementation it only asserts the queue.
    // I might need to update MessageBroker or do it here if I have access to channel.
    // However, for now I'll check if MessageBroker.subscribe needs binding.
  } catch (error) {
    logger.error('❌ Failed to initialize logistics events:', error);
  }
};
