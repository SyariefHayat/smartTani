import request from 'supertest';
import { app } from './index';
import { Promotion } from './models/promotion.model';

jest.mock('./models/promotion.model');

describe('Promotion API', () => {
  const mockFarmerId = 'farmer-123';
  const mockPromotionId = 'promotion-456';

  const validPromotion = {
    title: 'Diskon Panen',
    type: 'discount_percent',
    value: 10,
    product_ids: ['prod-1', 'prod-2'],
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 86400000).toISOString(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /promotions', () => {
    it('should create a promotion successfully', async () => {
      (Promotion.create as jest.Mock).mockResolvedValue({
        _id: mockPromotionId,
        farmer_id: mockFarmerId,
        ...validPromotion,
      });

      const response = await request(app)
        .post('/promotions')
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani')
        .send(validPromotion);

      expect(response.status).toBe(201);
      expect(response.body.data.title).toBe(validPromotion.title);
      expect(Promotion.create).toHaveBeenCalled();
    });

    it('should return 400 for invalid date range', async () => {
      const invalidPromo = {
        ...validPromotion,
        start_date: new Date(Date.now() + 86400000).toISOString(),
        end_date: new Date().toISOString(),
      };

      const response = await request(app)
        .post('/promotions')
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani')
        .send(invalidPromo);

      expect(response.status).toBe(422);
      expect(response.body.error.message).toContain('selesai harus setelah');
    });
  });

  describe('GET /promotions', () => {
    it('should list promotions for a farmer', async () => {
      const mockPromotions = [
        { _id: '1', title: 'Promo 1', farmer_id: mockFarmerId },
        { _id: '2', title: 'Promo 2', farmer_id: mockFarmerId },
      ];

      (Promotion.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockPromotions),
      });

      const response = await request(app).get('/promotions').query({ farmer_id: mockFarmerId });

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(Promotion.find).toHaveBeenCalledWith(
        expect.objectContaining({ farmer_id: mockFarmerId })
      );
    });
  });

  describe('PATCH /promotions/:id', () => {
    it('should update promotion if owner', async () => {
      (Promotion.findById as jest.Mock).mockResolvedValue({
        _id: mockPromotionId,
        farmer_id: mockFarmerId,
        status: 'active',
      });
      (Promotion.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: mockPromotionId,
        farmer_id: mockFarmerId,
        title: 'Updated Title',
      });

      const response = await request(app)
        .patch(`/promotions/${mockPromotionId}`)
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe('Updated Title');
    });

    it('should return 403 if not owner', async () => {
      (Promotion.findById as jest.Mock).mockResolvedValue({
        _id: mockPromotionId,
        farmer_id: 'other-farmer',
        status: 'active',
      });

      const response = await request(app)
        .patch(`/promotions/${mockPromotionId}`)
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani')
        .send({ title: 'Updated Title' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /promotions/:id', () => {
    it('should soft delete promotion if owner', async () => {
      (Promotion.findById as jest.Mock).mockResolvedValue({
        _id: mockPromotionId,
        farmer_id: mockFarmerId,
        status: 'active',
      });
      (Promotion.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: mockPromotionId,
        status: 'deleted',
      });

      const response = await request(app)
        .delete(`/promotions/${mockPromotionId}`)
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani');

      expect(response.status).toBe(200);
      expect(Promotion.findByIdAndUpdate).toHaveBeenCalledWith(
        mockPromotionId,
        { status: 'deleted' },
        { new: true }
      );
    });
  });
});
