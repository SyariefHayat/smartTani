import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      return res.status(201).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyEmail(req.body);
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.refresh(req.body);
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await authService.logout(refreshToken);
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AppRequest).user!.id;
      const user = await authService.getMe(userId);
      return res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AppRequest).user!.id;
      const user = await authService.updateProfile(userId, req.body);
      return res.status(200).json(successResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      // Manual parse query because the shared validate middleware only handles body
      const { GetUsersSchema } = await import('../schemas/auth.schema');
      const query = GetUsersSchema.parse(req.query);
      const result = await authService.getAllUsers(query);
      return res.status(200).json(successResponse(result.users, result.meta));
    } catch (error) {
      next(error);
    }
  }

  async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const result = await authService.verifyUser(id as string);
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
