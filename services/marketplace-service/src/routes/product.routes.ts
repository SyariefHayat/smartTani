import { Router } from 'express';
import productController from '../controllers/product.controller';
import { CreateProductSchema } from '../schemas/product.schema';
import { validate } from '../../../../shared/middleware/validate';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product listing (Farmer/Admin only)
 *     tags: [Product]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  gatewayAuthMiddleware,
  authorize(['petani', 'admin']),
  validate(CreateProductSchema),
  productController.createProduct
);

export default router;
