import { Router } from 'express';
import purchaseController from '../controllers/purchase.controller';
import { CreatePurchaseSchema, UpdatePurchaseSchema } from '../schemas/purchase.schema';
import { validate } from '../../../../shared/middleware/validate';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * /purchases:
 *   post:
 *     summary: Create a new purchase record (Farmer only)
 *     tags: [Purchase]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - supplier_name
 *               - item_name
 *               - quantity
 *               - unit
 *               - total_cost
 *               - purchase_date
 *             properties:
 *               supplier_name:
 *                 type: string
 *               item_name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               total_cost:
 *                 type: number
 *               purchase_date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               receipt_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Purchase record created successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  gatewayAuthMiddleware,
  authorize(['petani']),
  validate(CreatePurchaseSchema),
  purchaseController.create
);

/**
 * @swagger
 * /purchases:
 *   get:
 *     summary: List purchase records (Farmer only)
 *     tags: [Purchase]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of purchase records
 */
router.get('/', gatewayAuthMiddleware, authorize(['petani']), purchaseController.getAll);

/**
 * @swagger
 * /purchases/{id}:
 *   patch:
 *     summary: Update a purchase record (Farmer only)
 *     tags: [Purchase]
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
 *             properties:
 *               supplier_name:
 *                 type: string
 *               item_name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               total_cost:
 *                 type: number
 *               purchase_date:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *               receipt_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Purchase record updated successfully
 *       403:
 *         description: Forbidden
 */
router.patch(
  '/:id',
  gatewayAuthMiddleware,
  authorize(['petani']),
  validate(UpdatePurchaseSchema),
  purchaseController.update
);

/**
 * @swagger
 * /purchases/{id}:
 *   delete:
 *     summary: Delete a purchase record (Farmer only)
 *     tags: [Purchase]
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
 *         description: Purchase record deleted successfully
 *       403:
 *         description: Forbidden
 */
router.delete('/:id', gatewayAuthMiddleware, authorize(['petani']), purchaseController.delete);

export default router;
