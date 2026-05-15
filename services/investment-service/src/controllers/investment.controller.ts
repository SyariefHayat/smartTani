import { Request, Response, NextFunction } from 'express';
import investmentService from '../services/investment.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

class InvestmentController {
  async createInvestment(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string };
      const { proposalId, amount } = req.body;

      const investment = await investmentService.createInvestment(user.id, proposalId, amount);
      return res.status(201).json(successResponse(investment));
    } catch (error) {
      next(error);
    }
  }

  async getPortfolio(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as AppRequest).user as { id: string; role: string };
      const result = await investmentService.getPortfolio(user.id);
      return res.status(200).json(successResponse(result.investments, result.summary));
    } catch (error) {
      next(error);
    }
  }

  async completeInvestment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { actualReturnPercent } = req.body;

      const investment = await investmentService.completeInvestment(id as string, actualReturnPercent);
      return res.status(200).json(successResponse(investment));
    } catch (error) {
      next(error);
    }
  }
}

export default new InvestmentController();
