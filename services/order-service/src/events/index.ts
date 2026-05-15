import { logger } from '../../../../shared/utils/logger';
import MessageBroker from '../lib/broker';
import { BROKER_EXCHANGES, BROKER_QUEUES, BROKER_ROUTING_KEYS } from '../../../../shared/constants/broker';
import orderRepository from '../repositories/order.repository';

export const initEvents = async () => {
  try {
    // Ensure exchange exists
    await MessageBroker.createExchange(BROKER_EXCHANGES.EVENTS, 'topic');

    // 1. Subscribe to shipment.picked_up
    const queue = BROKER_QUEUES.ORDER;
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP);
    
    // 2. Subscribe to shipment.delivered
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED);
    
    await MessageBroker.subscribe(queue, async (payload: any, routingKey: string) => {
      logger.info(`📦 Received event ${routingKey} for order:`, payload.order_id);
      try {
        if (routingKey === BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP) {
          await orderRepository.updateStatus(payload.order_id, 'shipped');
          logger.info(`✅ Order ${payload.order_id} status updated to shipped`);
        } else if (routingKey === BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED) {
          await orderRepository.updateStatus(payload.order_id, 'delivered');
          logger.info(`✅ Order ${payload.order_id} status updated to delivered`);
        }
      } catch (error) {
        logger.error(`❌ Failed to update order ${payload.order_id} status for ${routingKey}:`, error);
      }
    });

  } catch (error) {
    logger.error('❌ Failed to initialize order events:', error);
  }
};
