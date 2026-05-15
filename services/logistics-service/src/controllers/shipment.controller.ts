import { Request, Response, NextFunction } from 'express';
import shipmentService from '../services/shipment.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

class ShipmentController {
  async getShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string };
      const query = req.query as any;

      const result = await shipmentService.getShipments(user, {
        status: query.status,
        page: Number(query.page || 1),
        limit: Number(query.limit || 20),
      });

      return res.status(200).json(successResponse(result.data, result.meta));
    } catch (error) {
      next(error);
    }
  }

  async trackShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const { order_id } = req.params;
      const shipment = await shipmentService.getShipmentByOrderId(order_id as string);
      
      return res.status(200).json(successResponse(shipment));
    } catch (error) {
      next(error);
    }
  }

  async pickupShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string };
      const { order_id } = req.params;
      const { notes } = req.body || {};

      const shipment = await shipmentService.pickupShipment(order_id as string, user, notes);
      return res.status(200).json(successResponse(shipment));
    } catch (error) {
      next(error);
    }
  }

  async transitShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string };
      const { order_id } = req.params;
      const { notes } = req.body || {};

      const shipment = await shipmentService.transitShipment(order_id as string, user, notes);
      return res.status(200).json(successResponse(shipment));
    } catch (error) {
      next(error);
    }
  }

  async deliverShipment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string };
      const { order_id } = req.params;
      const { notes } = req.body || {};

      const shipment = await shipmentService.deliverShipment(order_id as string, user, notes);
      return res.status(200).json(successResponse(shipment));
    } catch (error) {
      next(error);
    }
  }
}

export default new ShipmentController();
