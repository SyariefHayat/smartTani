import { Router } from 'express';
import shipmentController from '../controllers/shipment.controller';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { validateQuery } from '../../../../shared/middleware/validate';
import { GetShipmentsQuerySchema } from '../schemas/shipment.schema';

const router = Router();

router.get(
  '/',
  gatewayAuthMiddleware,
  authorize(['logistik', 'admin']),
  validateQuery(GetShipmentsQuerySchema),
  shipmentController.getShipments
);

router.get(
  '/:order_id',
  shipmentController.trackShipment
);

router.patch(
  '/:order_id/pickup',
  gatewayAuthMiddleware,
  authorize(['logistik', 'admin']),
  shipmentController.pickupShipment
);

router.patch(
  '/:order_id/transit',
  gatewayAuthMiddleware,
  authorize(['logistik', 'admin']),
  shipmentController.transitShipment
);

router.patch(
  '/:order_id/deliver',
  gatewayAuthMiddleware,
  authorize(['logistik', 'admin']),
  shipmentController.deliverShipment
);

export default router;
