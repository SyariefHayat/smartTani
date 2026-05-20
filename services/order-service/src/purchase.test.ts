import request from 'supertest';
import { app } from './index';
import prisma from './lib/prisma';

jest.mock('./lib/prisma', () => ({
  __esModule: true,
  default: {
    purchaseRecord: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Purchase API', () => {
  const mockFarmerId = '123e4567-e89b-12d3-a456-426614174000';
  const mockPurchaseId = '123e4567-e89b-12d3-a456-426614174001';

  const validPurchase = {
    supplier_name: 'Toko Tani Makmur',
    item_name: 'Pupuk Urea',
    quantity: 5,
    unit: 'karung',
    total_cost: 500000,
    purchase_date: new Date().toISOString(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /purchases', () => {
    it('should create a purchase record successfully', async () => {
      (prisma.purchaseRecord.create as jest.Mock).mockResolvedValue({
        id: mockPurchaseId,
        farmer_id: mockFarmerId,
        ...validPurchase,
      });

      const response = await request(app)
        .post('/purchases')
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani')
        .send(validPurchase);

      expect(response.status).toBe(201);
      expect(response.body.data.item_name).toBe(validPurchase.item_name);
    });

    it('should return 422 for invalid input', async () => {
      const invalidPurchase = { ...validPurchase, quantity: -1 };

      const response = await request(app)
        .post('/purchases')
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani')
        .send(invalidPurchase);

      expect(response.status).toBe(422);
    });
  });

  describe('GET /purchases', () => {
    it('should list purchase records for a farmer', async () => {
      const mockRecords = [{ id: '1', ...validPurchase, farmer_id: mockFarmerId }];
      (prisma.purchaseRecord.findMany as jest.Mock).mockResolvedValue(mockRecords);

      const response = await request(app)
        .get('/purchases')
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('PATCH /purchases/:id', () => {
    it('should update record if owner', async () => {
      (prisma.purchaseRecord.findUnique as jest.Mock).mockResolvedValue({
        id: mockPurchaseId,
        farmer_id: mockFarmerId,
      });
      (prisma.purchaseRecord.update as jest.Mock).mockResolvedValue({
        id: mockPurchaseId,
        item_name: 'Updated Item',
      });

      const response = await request(app)
        .patch(`/purchases/${mockPurchaseId}`)
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani')
        .send({ item_name: 'Updated Item' });

      expect(response.status).toBe(200);
      expect(response.body.data.item_name).toBe('Updated Item');
    });

    it('should return 403 if not owner', async () => {
      (prisma.purchaseRecord.findUnique as jest.Mock).mockResolvedValue({
        id: mockPurchaseId,
        farmer_id: 'other-farmer-id',
      });

      const response = await request(app)
        .patch(`/purchases/${mockPurchaseId}`)
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani')
        .send({ item_name: 'Updated Item' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /purchases/:id', () => {
    it('should delete record if owner', async () => {
      (prisma.purchaseRecord.findUnique as jest.Mock).mockResolvedValue({
        id: mockPurchaseId,
        farmer_id: mockFarmerId,
      });
      (prisma.purchaseRecord.delete as jest.Mock).mockResolvedValue({
        id: mockPurchaseId,
      });

      const response = await request(app)
        .delete(`/purchases/${mockPurchaseId}`)
        .set('x-user-id', mockFarmerId)
        .set('x-user-role', 'petani');

      expect(response.status).toBe(200);
    });
  });
});
