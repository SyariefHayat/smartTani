export const BROKER_EXCHANGES = {
  EVENTS: 'smarttani.events',
} as const;

export const BROKER_EXCHANGE_TYPES = {
  TOPIC: 'topic',
  DIRECT: 'direct',
  FANOUT: 'fanout',
} as const;

export const BROKER_QUEUES = {
  ORDER: 'order.events',
  INVESTMENT: 'investment.events',
  NOTIFICATION: 'notification.events',
  LOGISTICS: 'logistics.events',
  ANALYTICS: 'analytics.events',
} as const;

export const BROKER_ROUTING_KEYS = {
  // Order Events
  ORDER_CREATED: 'order.created',
  ORDER_PAID: 'order.paid',
  ORDER_CANCELLED: 'order.cancelled',
  ORDER_CONFIRMED: 'order.confirmed',
  ORDER_DELIVERED: 'order.delivered',
  ORDER_REFUND_REQUESTED: 'order.refund_requested',

  // Marketplace Events
  PRODUCT_CREATED: 'marketplace.product.created',
  PRODUCT_UPDATED: 'marketplace.product.updated',

  // Investment Events
  PROPOSAL_SUBMITTED: 'proposal.submitted',
  PROPOSAL_APPROVED: 'proposal.approved',
  PROPOSAL_REJECTED: 'proposal.rejected',
  PROPOSAL_FUNDED: 'proposal.funded',
  INVESTMENT_CREATED: 'investment.created',
  INVESTMENT_COMPLETED: 'investment.completed',

  // Shipment Events
  SHIPMENT_PICKED_UP: 'shipment.picked_up',
  SHIPMENT_IN_TRANSIT: 'shipment.in_transit',
  SHIPMENT_DELIVERED: 'shipment.delivered',

  // Auth Events
  AUTH_USER_REGISTERED: 'auth.user.registered',
  AUTH_USER_VERIFIED: 'auth.user.verified',
} as const;
