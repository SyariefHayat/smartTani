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

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId, role } = (req as AppRequest).user!;
      const { id: orderId } = req.params;
      const order = await orderService.getOrderById(orderId as string, userId, role as string);
      return res.status(200).json(successResponse(order));
    } catch (error) {
      next(error);
    }
  }

  async confirmOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId, role } = (req as AppRequest).user!;
      const { id: orderId } = req.params;
      const order = await orderService.confirmOrder(orderId as string, userId, role as string);
      return res.status(200).json(successResponse(order));
    } catch (error) {
      next(error);
    }
  }

  async deliverOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId, role } = (req as AppRequest).user!;
      const { id: orderId } = req.params;
      const order = await orderService.deliverOrder(orderId as string, userId, role as string);
      return res.status(200).json(successResponse(order));
    } catch (error) {
      next(error);
    }
  }

  async requestRefund(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: userId, role } = (req as AppRequest).user!;
      const { id: orderId } = req.params;
      const order = await orderService.requestRefund(
        orderId as string,
        userId,
        role as string,
        req.body
      );
      return res.status(200).json(successResponse(order));
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
