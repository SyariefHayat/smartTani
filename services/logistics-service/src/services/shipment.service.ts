import { logger } from '../../../../shared/utils/logger';
import { Shipment } from '../models/shipment.model';
import MessageBroker from '../lib/broker';

export class ShipmentService {
  async createShipment(data: { orderId: string; logisticId?: string }) {
    return Shipment.create({
      order_id: data.orderId,
      logistic_id: data.logisticId || 'PENDING', // For Q1 we might not have auto-assignment
      status: 'pending_pickup',
      status_history: [
        {
          status: 'pending_pickup',
          notes: 'Order confirmed by seller, waiting for pickup',
        },
      ],
    });
  }

  async getShipments(
    user: { id: string; role: string },
    query: { status?: string; page: number; limit: number }
  ) {
    const filter: any = {};

    if (user.role === 'logistik') {
      filter.logistic_id = user.id;
    }

    if (query.status) {
      filter.status = query.status;
    }

    const skip = (query.page - 1) * query.limit;

    const [data, total] = await Promise.all([
      Shipment.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(query.limit),
      Shipment.countDocuments(filter),
    ]);

    return {
      data,
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        total_pages: Math.ceil(total / query.limit),
      },
    };
  }

  async getShipmentByOrderId(orderId: string) {
    const shipment = await Shipment.findOne({ order_id: orderId });

    if (!shipment) {
      const error: any = new Error('Shipment tidak ditemukan');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    return shipment;
  }

  async pickupShipment(orderId: string, user: { id: string; role: string }, notes?: string) {
    const shipment = await Shipment.findOne({ order_id: orderId });

    if (!shipment) {
      const error: any = new Error('Shipment tidak ditemukan');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    // Authorization: only assigned logistic or admin
    if (user.role !== 'admin' && shipment.logistic_id !== user.id) {
      const error: any = new Error('Anda tidak memiliki akses ke shipment ini');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    if (shipment.status !== 'pending_pickup') {
      const error: any = new Error('Shipment tidak dalam status pending pickup');
      error.statusCode = 400;
      error.code = 'LOGISTICS_001';
      throw error;
    }

    const updatedShipment = await Shipment.findOneAndUpdate(
      { order_id: orderId },
      {
        status: 'picked_up',
        picked_up_at: new Date(),
        $push: {
          status_history: {
            status: 'picked_up',
            notes: notes || 'Paket telah diambil oleh kurir',
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    try {
      await MessageBroker.publish('smarttani.events', 'shipment.picked_up', {
        order_id: orderId,
        status: 'picked_up',
        picked_up_at: updatedShipment?.picked_up_at,
      });
    } catch (error) {
      logger.error('Failed to publish shipment.picked_up event', error);
    }

    return updatedShipment;
  }

  async transitShipment(orderId: string, user: { id: string; role: string }, notes?: string) {
    const shipment = await Shipment.findOne({ order_id: orderId });

    if (!shipment) {
      const error: any = new Error('Shipment tidak ditemukan');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (user.role !== 'admin' && shipment.logistic_id !== user.id) {
      const error: any = new Error('Anda tidak memiliki akses ke shipment ini');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    // Must be picked_up or already in_transit (for adding more notes)
    if (shipment.status !== 'picked_up' && shipment.status !== 'in_transit') {
      const error: any = new Error('Shipment harus sudah diambil (picked_up) sebelum dikirim');
      error.statusCode = 400;
      error.code = 'LOGISTICS_002';
      throw error;
    }

    const updatedShipment = await Shipment.findOneAndUpdate(
      { order_id: orderId },
      {
        status: 'in_transit',
        $push: {
          status_history: {
            status: 'in_transit',
            notes: notes || 'Paket sedang dalam perjalanan',
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    try {
      await MessageBroker.publish('smarttani.events', 'shipment.in_transit', {
        order_id: orderId,
        status: 'in_transit',
        notes,
        updated_at: new Date(),
      });
    } catch (error) {
      logger.error('Failed to publish shipment.in_transit event', error);
    }

    return updatedShipment;
  }

  async deliverShipment(orderId: string, user: { id: string; role: string }, notes?: string) {
    const shipment = await Shipment.findOne({ order_id: orderId });

    if (!shipment) {
      const error: any = new Error('Shipment tidak ditemukan');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (user.role !== 'admin' && shipment.logistic_id !== user.id) {
      const error: any = new Error('Anda tidak memiliki akses ke shipment ini');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    if (shipment.status !== 'in_transit') {
      const error: any = new Error('Shipment harus dalam status in_transit sebelum delivered');
      error.statusCode = 400;
      error.code = 'LOGISTICS_003';
      throw error;
    }

    const updatedShipment = await Shipment.findOneAndUpdate(
      { order_id: orderId },
      {
        status: 'delivered',
        delivered_at: new Date(),
        $push: {
          status_history: {
            status: 'delivered',
            notes: notes || 'Paket telah sampai di tujuan',
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    try {
      // Publish event to notify other services
      await MessageBroker.publish('smarttani.events', 'shipment.delivered', {
        order_id: orderId,
        status: 'delivered',
        delivered_at: updatedShipment?.delivered_at,
      });
    } catch (error) {
      logger.error('Failed to publish shipment.delivered event', error);
    }

    return updatedShipment;
  }
}

export default new ShipmentService();
