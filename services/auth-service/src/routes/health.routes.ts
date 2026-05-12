import { Router } from 'express';
import { getHealth } from '../controllers/health.controller';

const router = Router();

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Get service health status
 *     responses:
 *       200:
 *         description: Service is healthy
 *       503:
 *         description: Service or dependencies are unhealthy
 */
router.get('/', getHealth);

export default router;
