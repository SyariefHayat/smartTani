import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { CheckoutSchema } from '../schemas/cart.schema';
import { GetOrdersQuerySchema, OrderIdSchema, RefundSchema } from '../schemas/order.schema';
import { validate, validateQuery, validateParams } from '../../../../shared/middleware/validate';
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
 * /orders/{id}:
 *   get:
 *     summary: Get order detail by ID
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order detail
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.get(
  '/:id',
  gatewayAuthMiddleware,
  authorize(['buyer', 'petani', 'distributor', 'admin']),
  validateParams(OrderIdSchema),
  orderController.getOrderById
);

/**
 * @swagger
 * /orders/{id}/confirm:
 *   patch:
 *     summary: Petani confirm order (status paid -> confirmed_seller)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order confirmed successfully
 *       400:
 *         description: Order not paid or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.patch(
  '/:id/confirm',
  gatewayAuthMiddleware,
  authorize(['petani', 'admin']),
  validateParams(OrderIdSchema),
  orderController.confirmOrder
);

/**
 * @swagger
 * /orders/{id}/deliver:
 *   patch:
 *     summary: Buyer confirm order receipt (status shipped -> delivered)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order delivery confirmed successfully
 *       400:
 *         description: Order not shipped or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.patch(
  '/:id/deliver',
  gatewayAuthMiddleware,
  authorize(['buyer', 'admin']),
  validateParams(OrderIdSchema),
  orderController.deliverOrder
);

/**
 * @swagger
 * /orders/{id}/refund:
 *   post:
 *     summary: Buyer request refund for order (status paid/shipped -> refund_requested)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *                 minLength: 10
 *     responses:
 *       200:
 *         description: Refund request submitted successfully
 *       400:
 *         description: Order status not eligible or validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Order not found
 */
router.post(
  '/:id/refund',
  gatewayAuthMiddleware,
  authorize(['buyer', 'admin']),
  validateParams(OrderIdSchema),
  validate(RefundSchema),
  orderController.requestRefund
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
