import { Router } from 'express';
import investmentController from '../controllers/investment.controller';
import { validate } from '../../../../shared/middleware/validate';
import { CreateInvestmentSchema, CompleteInvestmentSchema } from '../schemas/investment.schema';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

router.get(
  '/',
  gatewayAuthMiddleware,
  authorize(['investor']),
  investmentController.getPortfolio
);

router.post(
  '/',
  gatewayAuthMiddleware,
  authorize(['investor']),
  validate(CreateInvestmentSchema),
  investmentController.createInvestment
);

router.patch(
  '/:id/complete',
  gatewayAuthMiddleware,
  authorize(['admin']),
  validate(CompleteInvestmentSchema),
  investmentController.completeInvestment
);

export default router;
