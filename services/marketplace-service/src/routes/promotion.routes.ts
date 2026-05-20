import { Router } from 'express';
import promotionController from '../controllers/promotion.controller';
import { CreatePromotionSchema, UpdatePromotionSchema } from '../schemas/promotion.schema';
import { validate } from '../../../../shared/middleware/validate';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * /promotions:
 *   post:
 *     summary: Create a new promotion (Farmer only)
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - value
 *               - product_ids
 *               - start_date
 *               - end_date
 *             properties:
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [discount_percent, discount_amount]
 *               value:
 *                 type: number
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Promotion created successfully
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  gatewayAuthMiddleware,
  authorize(['petani']),
  validate(CreatePromotionSchema),
  promotionController.create
);

/**
 * @swagger
 * /promotions:
 *   get:
 *     summary: Get all promotions
 *     tags: [Promotion]
 *     parameters:
 *       - in: query
 *         name: farmer_id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of promotions
 */
router.get('/', promotionController.getAll);

/**
 * @swagger
 * /promotions/{id}:
 *   get:
 *     summary: Get promotion by ID
 *     tags: [Promotion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion detail
 *       404:
 *         description: Not found
 */
router.get('/:id', promotionController.getOne);

/**
 * @swagger
 * /promotions/{id}:
 *   patch:
 *     summary: Update a promotion (Farmer only)
 *     tags: [Promotion]
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
 *               title:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [discount_percent, discount_amount]
 *               value:
 *                 type: number
 *               product_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *                 enum: [active, inactive, scheduled, expired]
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.patch(
  '/:id',
  gatewayAuthMiddleware,
  authorize(['petani']),
  validate(UpdatePromotionSchema),
  promotionController.update
);

/**
 * @swagger
 * /promotions/{id}:
 *   delete:
 *     summary: Delete a promotion (Farmer only)
 *     tags: [Promotion]
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
 *         description: Promotion deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete('/:id', gatewayAuthMiddleware, authorize(['petani']), promotionController.delete);

export default router;
