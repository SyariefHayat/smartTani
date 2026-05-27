import { Router } from 'express';
import brandController from '../controllers/brand.controller';

const router = Router();

/**
 * @swagger
 * /brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Brand]
 *     responses:
 *       200:
 *         description: List of all brands
 */
router.get('/', brandController.getBrands);

export default router;
