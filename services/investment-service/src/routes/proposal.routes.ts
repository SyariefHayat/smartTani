import { Router } from 'express';
import proposalController from '../controllers/proposal.controller';
import { validate, validateQuery, validateParams } from '../../../../shared/middleware/validate';
import { CreateProposalSchema, GetProposalsQuerySchema, ProposalIdSchema, UpdateProposalSchema, RejectProposalSchema } from '../schemas/proposal.schema';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

router.get(
  '/',
  gatewayAuthMiddleware,
  validateQuery(GetProposalsQuerySchema),
  proposalController.getProposals
);

router.get(
  '/:id',
  gatewayAuthMiddleware,
  validateParams(ProposalIdSchema),
  proposalController.getProposalById
);

router.post(
  '/',
  gatewayAuthMiddleware,
  authorize(['petani']),
  validate(CreateProposalSchema),
  proposalController.createProposal
);

router.patch(
  '/:id',
  gatewayAuthMiddleware,
  authorize(['petani']),
  validateParams(ProposalIdSchema),
  validate(UpdateProposalSchema),
  proposalController.updateProposal
);

router.post(
  '/:id/submit',
  gatewayAuthMiddleware,
  authorize(['petani']),
  validateParams(ProposalIdSchema),
  proposalController.submitProposal
);

router.post(
  '/:id/approve',
  gatewayAuthMiddleware,
  authorize(['admin']),
  validateParams(ProposalIdSchema),
  proposalController.approveProposal
);

router.post(
  '/:id/reject',
  gatewayAuthMiddleware,
  authorize(['admin']),
  validateParams(ProposalIdSchema),
  validate(RejectProposalSchema),
  proposalController.rejectProposal
);

export default router;
