import { Request, Response, NextFunction } from 'express';
import proposalService from '../services/proposal.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

class ProposalController {
  async createProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AppRequest).user!.id;
      const proposal = await proposalService.createProposal(userId, req.body);
      return res.status(201).json(successResponse(proposal));
    } catch (error) {
      next(error);
    }
  }

  async getProposals(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string; email?: string; full_name?: string };
      // Type assertion is safe here because of validation middleware
      const query = req.query as any; 
      
      const result = await proposalService.getProposals(query, user);
      return res.status(200).json(successResponse(result.data, result.meta));
    } catch (error) {
      next(error);
    }
  }

  async getProposalById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string; email?: string; full_name?: string };
      const id = req.params.id as string;
      
      const proposal = await proposalService.getProposalById(id, user);
      return res.status(200).json(successResponse(proposal));
    } catch (error) {
      next(error);
    }
  }

  async updateProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string; email?: string; full_name?: string };
      const id = req.params.id as string;
      
      const proposal = await proposalService.updateProposal(id, user.id, req.body);
      return res.status(200).json(successResponse(proposal));
    } catch (error) {
      next(error);
    }
  }

  async submitProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string; email?: string; full_name?: string };
      const id = req.params.id as string;
      
      const proposal = await proposalService.submitProposal(id, user.id);
      return res.status(200).json(successResponse(proposal));
    } catch (error) {
      next(error);
    }
  }

  async approveProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      
      const proposal = await proposalService.approveProposal(id);
      return res.status(200).json(successResponse(proposal));
    } catch (error) {
      next(error);
    }
  }

  async rejectProposal(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { reason } = req.body;

      const proposal = await proposalService.rejectProposal(id, reason);
      return res.status(200).json(successResponse(proposal));
    } catch (error) {
      next(error);
    }
  }
}

export default new ProposalController();
