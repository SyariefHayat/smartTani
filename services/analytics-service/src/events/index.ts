import { logger } from '../../../../shared/utils/logger';
import crypto from 'crypto';
import MessageBroker from '../lib/broker';
import { BROKER_EXCHANGES, BROKER_QUEUES, BROKER_ROUTING_KEYS } from '../../../../shared/constants/broker';
import prisma from '../lib/prisma';

export const initEvents = async () => {
  try {
    await MessageBroker.createExchange(BROKER_EXCHANGES.EVENTS, 'topic');
    const queue = BROKER_QUEUES.ANALYTICS;

    // 1. Auth Events
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.AUTH_USER_REGISTERED);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.AUTH_USER_VERIFIED);
    
    // 2. Order Events
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_CREATED);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_PAID);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_CONFIRMED);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_DELIVERED);

    // 3. Investment Events
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.PROPOSAL_SUBMITTED);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.PROPOSAL_APPROVED);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.INVESTMENT_CREATED);
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.PROPOSAL_FUNDED);

    await MessageBroker.subscribe(queue, async (payload: any, routingKey: string) => {
      logger.info(`📊 Analytics received event: ${routingKey}`);
      
      try {
        switch (routingKey) {
          case BROKER_ROUTING_KEYS.AUTH_USER_REGISTERED:
            await prisma.user.upsert({
              where: { id: payload.userId },
              update: { full_name: payload.fullName },
              create: {
                id: payload.userId,
                email: payload.email,
                role: payload.role || 'unknown',
                status: payload.status || 'active',
                full_name: payload.fullName,
              }
            });
            break;

          case BROKER_ROUTING_KEYS.AUTH_USER_VERIFIED:
            await prisma.user.upsert({
              where: { id: payload.userId },
              update: { status: 'active', full_name: payload.fullName },
              create: {
                id: payload.userId,
                email: payload.email,
                role: payload.role || 'unknown',
                status: 'active',
                full_name: payload.fullName,
              }
            });
            break;

          case BROKER_ROUTING_KEYS.ORDER_CREATED:
            await prisma.order.create({
              data: {
                id: payload.orderId,
                buyer_id: payload.buyerId,
                total_amount: payload.totalAmount,
                status: 'pending_payment',
                items: {
                  create: payload.items.map((item: any) => ({
                    id: item.id || crypto.randomUUID(), // Fallback if missing
                    product_id: item.productId,
                    farmer_id: item.farmerId,
                    quantity: item.quantity,
                    price_per_unit: item.price,
                    subtotal: item.subtotal || (item.quantity * item.price)
                  }))
                }
              }
            });
            break;

          case BROKER_ROUTING_KEYS.ORDER_PAID:
          case BROKER_ROUTING_KEYS.ORDER_CONFIRMED:
          case BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP:
          case BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED:
          case BROKER_ROUTING_KEYS.ORDER_DELIVERED:
            let status = 'paid';
            if (routingKey === BROKER_ROUTING_KEYS.ORDER_CONFIRMED) status = 'confirmed_seller';
            if (routingKey === BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP) status = 'shipped';
            if (routingKey === BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED) status = 'delivered';
            if (routingKey === BROKER_ROUTING_KEYS.ORDER_DELIVERED) status = 'completed';
            
            await prisma.order.update({
              where: { id: payload.orderId || payload.order_id },
              data: { status }
            });
            break;

          case BROKER_ROUTING_KEYS.PROPOSAL_SUBMITTED:
            await prisma.proposal.create({
              data: {
                id: payload.id,
                farmer_id: payload.farmer_id,
                title: payload.title,
                commodity: payload.commodity,
                funding_needed: payload.funding_needed,
                funding_raised: 0,
                status: 'pending'
              }
            });
            break;

          case BROKER_ROUTING_KEYS.PROPOSAL_APPROVED:
            await prisma.proposal.update({
              where: { id: payload.id },
              data: { status: 'active' }
            });
            break;

          case BROKER_ROUTING_KEYS.INVESTMENT_CREATED:
            await prisma.investment.create({
              data: {
                id: payload.investmentId,
                investor_id: payload.investorId,
                proposal_id: payload.proposalId,
                amount: payload.amount,
                status: 'paid'
              }
            });
            // Update funding_raised
            await prisma.proposal.update({
              where: { id: payload.proposalId },
              data: {
                funding_raised: { increment: payload.amount }
              }
            });
            break;

          case BROKER_ROUTING_KEYS.PROPOSAL_FUNDED:
            await prisma.investment.create({
              data: {
                id: payload.investmentId,
                investor_id: payload.investorId,
                proposal_id: payload.proposalId,
                amount: payload.amount,
                status: 'paid'
              }
            });
            // Update funding_raised
            await prisma.proposal.update({
              where: { id: payload.proposalId },
              data: {
                funding_raised: { increment: payload.amount }
              }
            });
            break;
        }
      } catch (err) {
        logger.error(`❌ Analytics failed to process event ${routingKey}:`, err);
      }
    });
  } catch (error) {
    logger.error('❌ Failed to initialize analytics events:', error);
  }
};
