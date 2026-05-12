import { Router, Request, Response } from 'express';
import { register } from '../lib/metrics';

const router = Router();

/**
 * @openapi
 * /metrics:
 *   get:
 *     tags:
 *       - Monitoring
 *     summary: Get Prometheus metrics
 *     responses:
 *       200:
 *         description: Prometheus metrics in text format
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (error) {
    res.status(500).end(error);
  }
});

export default router;
