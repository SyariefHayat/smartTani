import { logger } from '../../../../shared/utils/logger';
import crypto from 'crypto';
import MessageBroker from '../lib/broker';
import {
  BROKER_EXCHANGES,
  BROKER_QUEUES,
  BROKER_ROUTING_KEYS,
} from '../../../../shared/constants/broker';
import prisma from '../lib/prisma';

export const initEvents = async () => {
  try {
    await MessageBroker.createExchange(BROKER_EXCHANGES.EVENTS, 'topic');
    const queue = BROKER_QUEUES.ANALYTICS;

    // 1. Auth Events
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.AUTH_USER_REGISTERED
    );
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.AUTH_USER_VERIFIED
    );

    // 2. Order Events
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.ORDER_CREATED
    );
    await MessageBroker.bindQueue(queue, BROKER_EXCHANGES.EVENTS, BROKER_ROUTING_KEYS.ORDER_PAID);
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.ORDER_CONFIRMED
    );
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP
    );
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED
    );
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.ORDER_DELIVERED
    );

    // 3. Marketplace Events
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.PRODUCT_CREATED
    );
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.PRODUCT_UPDATED
    );

    // 4. Investment Events
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.PROPOSAL_SUBMITTED
    );
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.PROPOSAL_APPROVED
    );
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.INVESTMENT_CREATED
    );
    await MessageBroker.bindQueue(
      queue,
      BROKER_EXCHANGES.EVENTS,
      BROKER_ROUTING_KEYS.PROPOSAL_FUNDED
    );

    await MessageBroker.subscribe(
      queue,
      async (payload: Record<string, unknown>, routingKey: string) => {
        logger.info(`📊 Analytics received event: ${routingKey}`);

        try {
          switch (routingKey) {
            case BROKER_ROUTING_KEYS.AUTH_USER_REGISTERED:
              await prisma.user.upsert({
                where: { id: payload.userId as string },
                update: { full_name: payload.fullName as string },
                create: {
                  id: payload.userId as string,
                  email: payload.email as string,
                  role: (payload.role as string) || 'unknown',
                  status: (payload.status as string) || 'active',
                  full_name: payload.fullName as string,
                },
              });
              break;

            case BROKER_ROUTING_KEYS.AUTH_USER_VERIFIED:
              await prisma.user.upsert({
                where: { id: payload.userId as string },
                update: { status: 'active', full_name: payload.fullName as string },
                create: {
                  id: payload.userId as string,
                  email: payload.email as string,
                  role: (payload.role as string) || 'unknown',
                  status: 'active',
                  full_name: payload.fullName as string,
                },
              });
              break;

            case BROKER_ROUTING_KEYS.ORDER_CREATED:
              await prisma.order.create({
                data: {
                  id: payload.orderId as string,
                  buyer_id: payload.buyerId as string,
                  total_amount: payload.totalAmount as number,
                  status: 'pending_payment',
                  items: {
                    create: (payload.items as Record<string, unknown>[]).map(
                      (item: Record<string, unknown>) => ({
                        id: (item.id as string) || crypto.randomUUID(), // Fallback if missing
                        product_id: item.productId as string,
                        farmer_id: item.farmerId as string,
                        quantity: item.quantity as number,
                        price_per_unit: item.price as number,
                        subtotal:
                          (item.subtotal as number) ||
                          (item.quantity as number) * (item.price as number),
                      })
                    ),
                  },
                },
              });
              break;

            case BROKER_ROUTING_KEYS.ORDER_PAID:
            case BROKER_ROUTING_KEYS.ORDER_CONFIRMED:
            case BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP:
            case BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED:
            case BROKER_ROUTING_KEYS.ORDER_DELIVERED: {
              let status = 'paid';
              if (routingKey === BROKER_ROUTING_KEYS.ORDER_CONFIRMED) status = 'confirmed_seller';
              if (routingKey === BROKER_ROUTING_KEYS.SHIPMENT_PICKED_UP) status = 'shipped';
              if (routingKey === BROKER_ROUTING_KEYS.SHIPMENT_DELIVERED) status = 'delivered';
              if (routingKey === BROKER_ROUTING_KEYS.ORDER_DELIVERED) status = 'completed';

              await prisma.order.update({
                where: { id: (payload.orderId as string) || (payload.order_id as string) },
                data: { status },
              });
              break;
            }

            case BROKER_ROUTING_KEYS.PRODUCT_CREATED:
            case BROKER_ROUTING_KEYS.PRODUCT_UPDATED:
              await prisma.product.upsert({
                where: { id: (payload.id as string) || (payload.productId as string) },
                update: {
                  title: payload.title as string,
                  image: Array.isArray(payload.images)
                    ? payload.images[0]
                    : (payload.image as string),
                  status: payload.status as string,
                  farmer_id: (payload.farmer_id as string) || (payload.farmerId as string),
                },
                create: {
                  id: (payload.id as string) || (payload.productId as string),
                  title: payload.title as string,
                  image: Array.isArray(payload.images)
                    ? payload.images[0]
                    : (payload.image as string),
                  status: payload.status as string,
                  farmer_id: (payload.farmer_id as string) || (payload.farmerId as string),
                },
              });
              break;

            case BROKER_ROUTING_KEYS.PROPOSAL_SUBMITTED:
              await prisma.proposal.create({
                data: {
                  id: payload.id as string,
                  farmer_id: payload.farmer_id as string,
                  title: payload.title as string,
                  commodity: payload.commodity as string,
                  funding_needed: payload.funding_needed as number,
                  funding_raised: 0,
                  status: 'pending',
                },
              });
              break;

            case BROKER_ROUTING_KEYS.PROPOSAL_APPROVED:
              await prisma.proposal.update({
                where: { id: payload.id as string },
                data: { status: 'active' },
              });
              break;

            case BROKER_ROUTING_KEYS.INVESTMENT_CREATED:
              await prisma.investment.create({
                data: {
                  id: payload.investmentId as string,
                  investor_id: payload.investorId as string,
                  proposal_id: payload.proposalId as string,
                  amount: payload.amount as number,
                  status: 'paid',
                },
              });
              // Update funding_raised
              await prisma.proposal.update({
                where: { id: payload.proposalId as string },
                data: {
                  funding_raised: { increment: payload.amount as number },
                },
              });
              break;

            case BROKER_ROUTING_KEYS.PROPOSAL_FUNDED:
              await prisma.investment.create({
                data: {
                  id: payload.investmentId as string,
                  investor_id: payload.investorId as string,
                  proposal_id: payload.proposalId as string,
                  amount: payload.amount as number,
                  status: 'paid',
                },
              });
              // Update funding_raised
              await prisma.proposal.update({
                where: { id: payload.proposalId as string },
                data: {
                  funding_raised: { increment: payload.amount as number },
                },
              });
              break;
          }
        } catch (err) {
          logger.error(`❌ Analytics failed to process event ${routingKey}:`, err);
        }
      }
    );
  } catch (error) {
    logger.error('❌ Failed to initialize analytics events:', error);
  }
};
