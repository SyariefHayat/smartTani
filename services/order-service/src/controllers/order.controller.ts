import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';
import { GetOrdersQuery } from '../schemas/order.schema';

export class OrderController {
  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, role } = (req as AppRequest).user!;
      const result = await orderService.getOrders(
        id,
        role as string,
        req.query as unknown as GetOrdersQuery
      );
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AppRequest).user!.id;
      const order = await orderService.checkout(userId, req.body);
      return res.status(201).json(successResponse(order));
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
