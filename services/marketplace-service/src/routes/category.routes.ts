import { Router } from 'express';
import categoryController from '../controllers/category.controller';

const router = Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Category]
 *     responses:
 *       200:
 *         description: List of all categories
 */
router.get('/', categoryController.getCategories);

export default router;
