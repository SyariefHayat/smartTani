import { Router } from 'express';
import orderController from '../controllers/order.controller';
import { CheckoutSchema } from '../schemas/cart.schema';
import { validate } from '../../../../shared/middleware/validate';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

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
