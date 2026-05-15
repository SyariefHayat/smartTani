import { Request, Response, NextFunction } from 'express';
import overviewService from '../services/overview.service';
import userAnalyticsService from '../services/user-analytics.service';
import orderAnalyticsService from '../services/order-analytics.service';
import investmentAnalyticsService from '../services/investment-analytics.service';
import personalAnalyticsService from '../services/personal-analytics.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

class OverviewController {
  async getOverview(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await overviewService.getOverview();
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getUserGrowth(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const data = await userAnalyticsService.getUserGrowth(query);
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getOrderAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as any;
      const data = await orderAnalyticsService.getOrderAnalytics(query);
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getInvestmentAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await investmentAnalyticsService.getInvestmentAnalytics();
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getFarmerAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = (req as AppRequest).user as { id: string; role: string };

      if (user.role !== 'admin' && user.id !== id) {
        const error: any = new Error('Anda tidak memiliki akses ke data ini');
        error.statusCode = 403;
        error.code = 'FORBIDDEN';
        throw error;
      }

      const data = await personalAnalyticsService.getFarmerAnalytics(id as string);
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getInvestorAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const user = (req as AppRequest).user as { id: string; role: string };

      if (user.role !== 'admin' && user.id !== id) {
        const error: any = new Error('Anda tidak memiliki akses ke data ini');
        error.statusCode = 403;
        error.code = 'FORBIDDEN';
        throw error;
      }

      const data = await personalAnalyticsService.getInvestorAnalytics(id as string);
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

export default new OverviewController();
