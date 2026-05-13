import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { CheckoutSchema } from '../schemas/cart.schema';
import { GetOrdersQuerySchema } from '../schemas/order.schema';
import { validate, validateQuery } from '../../../../shared/middleware/validate';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: List orders with filters
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of orders
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  gatewayAuthMiddleware,
  authorize(['buyer', 'petani', 'distributor', 'admin']),
  validateQuery(GetOrdersQuerySchema),
  orderController.getOrders
);

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Checkout items from cart and create order
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CheckoutInput'
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error or cart issues
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Stock conflict
 */
router.post(
  '/',
  gatewayAuthMiddleware,
  authorize(['buyer', 'distributor', 'admin']),
  validate(CheckoutSchema),
  orderController.checkout
);

export default router;
