import { Router } from 'express';
import paymentController from '../controllers/payment.controller';
import { InitiatePaymentSchema } from '../schemas/payment.schema';
import { validate } from '../../../../shared/middleware/validate';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /payments/initiate:
 *   post:
 *     summary: Generate Midtrans payment link
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InitiatePaymentInput'
 *     responses:
 *       200:
 *         description: Payment link generated
 *       400:
 *         description: Order cannot be paid
 *       403:
 *         description: Forbidden access to order
 *       404:
 *         description: Order not found
 */
router.post(
  '/initiate',
  gatewayAuthMiddleware,
  validate(InitiatePaymentSchema),
  paymentController.initiate
);

export default router;
