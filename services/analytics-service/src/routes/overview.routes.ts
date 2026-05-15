import { Router } from 'express';
import overviewController from '../controllers/overview.controller';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';
import { validateQuery } from '../../../../shared/middleware/validate';
import { UserGrowthQuerySchema, OrderAnalyticsQuerySchema } from '../schemas/analytics.schema';

const router = Router();

/**
 * @swagger
 * /analytics/overview:
 *   get:
 *     summary: Get platform overview analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform overview metrics
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
router.get(
  '/overview',
  gatewayAuthMiddleware,
  authorize(['admin']),
  overviewController.getOverview
);

/**
 * @swagger
 * /analytics/users:
 *   get:
 *     summary: Get user growth analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: granularity
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *     responses:
 *       200:
 *         description: User growth data
 */
router.get(
  '/users',
  gatewayAuthMiddleware,
  authorize(['admin']),
  validateQuery(UserGrowthQuerySchema),
  overviewController.getUserGrowth
);

/**
 * @swagger
 * /analytics/orders:
 *   get:
 *     summary: Get order sales analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: granularity
 *         schema:
 *           type: string
 *           enum: [day, week, month]
 *     responses:
 *       200:
 *         description: Order analytics data
 */
router.get(
  '/orders',
  gatewayAuthMiddleware,
  authorize(['admin']),
  validateQuery(OrderAnalyticsQuerySchema),
  overviewController.getOrderAnalytics
);

/**
 * @swagger
 * /analytics/investments:
 *   get:
 *     summary: Get investment analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Investment analytics data
 */
router.get(
  '/investments',
  gatewayAuthMiddleware,
  authorize(['admin']),
  overviewController.getInvestmentAnalytics
);

/**
 * @swagger
 * /analytics/farmer/{id}:
 *   get:
 *     summary: Get personal analytics for a farmer
 *     tags: [Analytics]
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
 *         description: Farmer analytics data
 */
router.get(
  '/farmer/:id',
  gatewayAuthMiddleware,
  overviewController.getFarmerAnalytics
);

/**
 * @swagger
 * /analytics/investor/{id}:
 *   get:
 *     summary: Get personal analytics for an investor
 *     tags: [Analytics]
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
 *         description: Investor analytics data
 */
router.get(
  '/investor/:id',
  gatewayAuthMiddleware,
  overviewController.getInvestorAnalytics
);

export default router;
