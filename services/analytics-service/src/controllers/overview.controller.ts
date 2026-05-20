import { Request, Response, NextFunction } from 'express';
import overviewService from '../services/overview.service';
import userAnalyticsService from '../services/user-analytics.service';
import orderAnalyticsService from '../services/order-analytics.service';
import investmentAnalyticsService from '../services/investment-analytics.service';
import personalAnalyticsService from '../services/personal-analytics.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

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
      const query = req.query as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await userAnalyticsService.getUserGrowth(query as any);
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getOrderAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await orderAnalyticsService.getOrderAnalytics(query as any);
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
      const id = req.params.id as string;
      const user = (req as AppRequest).user as { id: string; role: string };

      if (user.role !== 'admin' && user.id !== id) {
        const error: CustomError = new Error('Anda tidak memiliki akses ke data ini');
        error.statusCode = 403;
        error.code = 'FORBIDDEN';
        throw error;
      }

      const data = await personalAnalyticsService.getFarmerAnalytics(id);
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getFarmerRevenueChart(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = (req as AppRequest).user as { id: string; role: string };

      if (user.role !== 'admin' && user.id !== id) {
        const error: CustomError = new Error('Anda tidak memiliki akses ke data ini');
        error.statusCode = 403;
        error.code = 'FORBIDDEN';
        throw error;
      }

      const query = req.query as Record<string, unknown>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = await personalAnalyticsService.getFarmerRevenueChart(id, query as any);
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }

  async getInvestorAnalytics(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const user = (req as AppRequest).user as { id: string; role: string };

      if (user.role !== 'admin' && user.id !== id) {
        const error: CustomError = new Error('Anda tidak memiliki akses ke data ini');
        error.statusCode = 403;
        error.code = 'FORBIDDEN';
        throw error;
      }

      const data = await personalAnalyticsService.getInvestorAnalytics(id);
      return res.status(200).json(successResponse(data));
    } catch (error) {
      next(error);
    }
  }
}

export default new OverviewController();
