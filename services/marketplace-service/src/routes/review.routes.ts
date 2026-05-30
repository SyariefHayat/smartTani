import { Router } from 'express';
import reviewController from '../controllers/review.controller';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

// Semua rute ini memerlukan autentikasi
router.use(gatewayAuthMiddleware);

// Endpoint ulasan saya untuk buyer
router.get('/me', authorize(['buyer']), reviewController.getBuyerReviews);

export default router;
