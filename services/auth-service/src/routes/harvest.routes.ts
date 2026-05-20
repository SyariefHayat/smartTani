import { Router } from 'express';
import harvestController from '../controllers/harvest.controller';
import { CreateHarvestSchema, UpdateHarvestSchema } from '../schemas/harvest.schema';
import { validate } from '../../../../shared/middleware/validate';
import { authenticate } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

/**
 * @swagger
 * /harvests:
 *   post:
 *     summary: Create a new harvest record (Farmer only)
 *     tags: [Harvest]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - land_id
 *               - crop_name
 *               - quantity
 *               - unit
 *               - harvest_date
 *               - quality_grade
 *             properties:
 *               land_id:
 *                 type: string
 *                 format: uuid
 *               crop_name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               harvest_date:
 *                 type: string
 *                 format: date
 *               quality_grade:
 *                 type: string
 *                 enum: [A, B, C]
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Harvest record created successfully
 */
router.post(
  '/',
  authenticate,
  authorize(['petani']),
  validate(CreateHarvestSchema),
  harvestController.create
);

/**
 * @swagger
 * /harvests:
 *   get:
 *     summary: List all harvest records for current farmer
 *     tags: [Harvest]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of harvest records
 */
router.get('/', authenticate, authorize(['petani']), harvestController.getAll);

/**
 * @swagger
 * /harvests/{id}:
 *   patch:
 *     summary: Update a harvest record
 *     tags: [Harvest]
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
 *               land_id:
 *                 type: string
 *               crop_name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               unit:
 *                 type: string
 *               harvest_date:
 *                 type: string
 *               quality_grade:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Harvest record updated successfully
 */
router.patch(
  '/:id',
  authenticate,
  authorize(['petani']),
  validate(UpdateHarvestSchema),
  harvestController.update
);

/**
 * @swagger
 * /harvests/{id}:
 *   delete:
 *     summary: Delete a harvest record
 *     tags: [Harvest]
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
 *         description: Harvest record deleted successfully
 */
router.delete('/:id', authenticate, authorize(['petani']), harvestController.delete);

export default router;
