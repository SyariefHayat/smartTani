import { Router } from 'express';
import cartController from '../controllers/cart.controller';
import { AddToCartSchema } from '../schemas/cart.schema';
import { validate } from '../../../../shared/middleware/validate';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * /cart/items:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddToCartInput'
 *     responses:
 *       200:
 *         description: Item added to cart
 *       400:
 *         description: Validation error or stock issues
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/items',
  gatewayAuthMiddleware,
  authorize(['buyer', 'distributor', 'admin']),
  validate(AddToCartSchema),
  cartController.addToCart
);

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get current user cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart retrieved successfully
 */
router.get(
  '/',
  gatewayAuthMiddleware,
  authorize(['buyer', 'distributor', 'admin']),
  cartController.getCart
);

export default router;
