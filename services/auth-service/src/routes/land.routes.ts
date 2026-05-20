import { Router } from 'express';
import landController from '../controllers/land.controller';
import { CreateLandSchema, UpdateLandSchema } from '../schemas/land.schema';
import { validate } from '../../../../shared/middleware/validate';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * /lands:
 *   post:
 *     summary: Create a new farm land (Farmer only)
 *     tags: [Land]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location_province
 *               - location_city
 *               - location_district
 *               - full_address
 *               - area_ha
 *             properties:
 *               name:
 *                 type: string
 *               location_province:
 *                 type: string
 *               location_city:
 *                 type: string
 *               location_district:
 *                 type: string
 *               full_address:
 *                 type: string
 *               area_ha:
 *                 type: number
 *               soil_type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, fallow, rented]
 *               current_crop:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Land record created successfully
 */
router.post(
  '/',
  authenticate,
  authorize(['petani']),
  validate(CreateLandSchema),
  landController.create
);

/**
 * @swagger
 * /lands:
 *   get:
 *     summary: List all farm lands for current farmer
 *     tags: [Land]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of farm lands
 */
router.get('/', authenticate, authorize(['petani']), landController.getAll);

/**
 * @swagger
 * /lands/{id}:
 *   patch:
 *     summary: Update a farm land
 *     tags: [Land]
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
 *               name:
 *                 type: string
 *               location_province:
 *                 type: string
 *               location_city:
 *                 type: string
 *               location_district:
 *                 type: string
 *               full_address:
 *                 type: string
 *               area_ha:
 *                 type: number
 *               soil_type:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, fallow, rented]
 *               current_crop:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Land record updated successfully
 */
router.patch(
  '/:id',
  authenticate,
  authorize(['petani']),
  validate(UpdateLandSchema),
  landController.update
);

/**
 * @swagger
 * /lands/{id}:
 *   delete:
 *     summary: Delete a farm land
 *     tags: [Land]
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
 *         description: Land record deleted successfully
 */
router.delete('/:id', authenticate, authorize(['petani']), landController.delete);

export default router;
