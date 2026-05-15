import { logger } from '../../../../shared/utils/logger';
import MessageBroker from '../lib/broker';
import { BROKER_EXCHANGES, BROKER_QUEUES, BROKER_ROUTING_KEYS } from '../../../../shared/constants/broker';
import * as handlers from './handlers';

export const initEvents = async () => {
  try {
    // Ensure exchange exists
    await MessageBroker.createExchange(BROKER_EXCHANGES.EVENTS, 'topic');

    const queue = BROKER_QUEUES.NOTIFICATION;

    // Mapping of routing keys to their respective handlers
    const handlerMap: Record<string, (payload: any) => Promise<void>> = {
      [BROKER_ROUTING_KEYS.AUTH_USER_REGISTERED]: handlers.handleUserRegistered,
      [BROKER_ROUTING_KEYS.ORDER_CREATED]: handlers.handleOrderCreated,
      [BROKER_ROUTING_KEYS.ORDER_PAID]: handlers.handleOrderPaid,
      [BROKER_ROUTING_KEYS.PROPOSAL_APPROVED]: handlers.handleProposalApproved,
      [BROKER_ROUTING_KEYS.PROPOSAL_REJECTED]: handlers.handleProposalRejected,
      [BROKER_ROUTING_KEYS.PROPOSAL_FUNDED]: handlers.handleProposalFunded,
      [BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP]: handlers.handleShipmentPickedUp,
      [BROKER_ROUTING_KEYS.SHIPMENT_IN_TRANSIT]: handlers.handleShipmentInTransit,
      [BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED]: handlers.handleShipmentDelivered,
      [BROKER_ROUTING_KEYS.INVESTMENT_COMPLETED]: handlers.handleInvestmentCompleted,
    };

    // Bind all mapped routing keys to the notification queue
    for (const routingKey of Object.keys(handlerMap)) {
      await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, routingKey);
    }

    // Single subscription for the notification queue with routing key awareness
    await MessageBroker.subscribe(queue, async (payload: any, routingKey: string) => {
      logger.info(`🔔 Received event: ${routingKey}`);
      
      const handler = handlerMap[routingKey];
      
      if (handler) {
        try {
          await handler(payload);
          logger.info(`✅ Handled ${routingKey} successfully`);
        } catch (error) {
          logger.error(`❌ Failed to handle event ${routingKey}:`, error);
        }
      } else {
        logger.warn(`⚠️ No handler found for routing key: ${routingKey}`);
      }
    });

    logger.info('✅ Notification events initialized and subscribed');
  } catch (error) {
    logger.error('❌ Failed to initialize notification events:', error);
  }
};
