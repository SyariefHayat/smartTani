import request from 'supertest';
import { app } from './index';
import prisma from './lib/prisma';
import { signAccessToken } from '../../../shared/utils/jwt';
import { env } from './config/env';

jest.mock('./lib/prisma', () => ({
  __esModule: true,
  default: {
    harvestRecord: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    farmLand: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Harvest API', () => {
  const mockFarmerId = '123e4567-e89b-12d3-a456-426614174000';
  const mockLandId = '123e4567-e89b-12d3-a456-426614174001';
  const mockHarvestId = '123e4567-e89b-12d3-a456-426614174002';
  const mockToken = signAccessToken(
    { userId: mockFarmerId, role: 'petani', email: 'farmer@test.com' },
    env.JWT_SECRET,
    '1h'
  );

  const validHarvest = {
    land_id: mockLandId,
    crop_name: 'Padi Ciherang',
    quantity: 500.5,
    unit: 'kg',
    harvest_date: '2024-05-20',
    quality_grade: 'A',
    notes: 'Panen melimpah',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /harvests', () => {
    it('should create a harvest record successfully', async () => {
      (prisma.farmLand.findUnique as jest.Mock).mockResolvedValue({
        id: mockLandId,
        farmer_id: mockFarmerId,
      });
      (prisma.harvestRecord.create as jest.Mock).mockResolvedValue({
        id: mockHarvestId,
        farmer_id: mockFarmerId,
        ...validHarvest,
      });

      const response = await request(app)
        .post('/harvests')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(validHarvest);

      expect(response.status).toBe(201);
      expect(response.body.data.crop_name).toBe(validHarvest.crop_name);
    });

    it('should return 403 if land not owned by farmer', async () => {
      (prisma.farmLand.findUnique as jest.Mock).mockResolvedValue({
        id: mockLandId,
        farmer_id: 'other-farmer-id',
      });

      const response = await request(app)
        .post('/harvests')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(validHarvest);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /harvests', () => {
    it('should list harvests for a farmer', async () => {
      const mockHarvests = [{ id: '1', ...validHarvest, farmer_id: mockFarmerId }];
      (prisma.harvestRecord.findMany as jest.Mock).mockResolvedValue(mockHarvests);

      const response = await request(app)
        .get('/harvests')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('PATCH /harvests/:id', () => {
    it('should update harvest if owner', async () => {
      (prisma.harvestRecord.findUnique as jest.Mock).mockResolvedValue({
        id: mockHarvestId,
        farmer_id: mockFarmerId,
        land_id: mockLandId,
      });
      (prisma.harvestRecord.update as jest.Mock).mockResolvedValue({
        id: mockHarvestId,
        crop_name: 'Padi Updated',
      });

      const response = await request(app)
        .patch(`/harvests/${mockHarvestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ crop_name: 'Padi Updated' });

      expect(response.status).toBe(200);
      expect(response.body.data.crop_name).toBe('Padi Updated');
    });

    it('should return 404 if harvest not found', async () => {
      (prisma.harvestRecord.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .patch(`/harvests/${mockHarvestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ crop_name: 'Padi Updated' });

      expect(response.status).toBe(404);
    });

    it('should return 403 if harvest not owned by farmer', async () => {
      (prisma.harvestRecord.findUnique as jest.Mock).mockResolvedValue({
        id: mockHarvestId,
        farmer_id: 'other-farmer-id',
        land_id: mockLandId,
      });

      const response = await request(app)
        .patch(`/harvests/${mockHarvestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ crop_name: 'Padi Updated' });

      expect(response.status).toBe(403);
    });

    it('should return 403 if updating land to land not owned by farmer', async () => {
      (prisma.harvestRecord.findUnique as jest.Mock).mockResolvedValue({
        id: mockHarvestId,
        farmer_id: mockFarmerId,
        land_id: mockLandId,
      });
      (prisma.farmLand.findUnique as jest.Mock).mockResolvedValue({
        id: 'new-land-id',
        farmer_id: 'other-farmer-id',
      });

      const response = await request(app)
        .patch(`/harvests/${mockHarvestId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ land_id: '123e4567-e89b-12d3-a456-426614174003' }); // valid UUID

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /harvests/:id', () => {
    it('should delete harvest if owner', async () => {
      (prisma.harvestRecord.findUnique as jest.Mock).mockResolvedValue({
        id: mockHarvestId,
        farmer_id: mockFarmerId,
      });
      (prisma.harvestRecord.delete as jest.Mock).mockResolvedValue({
        id: mockHarvestId,
      });

      const response = await request(app)
        .delete(`/harvests/${mockHarvestId}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
    });

    it('should return 404 if harvest not found', async () => {
      (prisma.harvestRecord.findUnique as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .delete(`/harvests/${mockHarvestId}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
    });

    it('should return 403 if harvest not owned by farmer', async () => {
      (prisma.harvestRecord.findUnique as jest.Mock).mockResolvedValue({
        id: mockHarvestId,
        farmer_id: 'other-farmer-id',
      });

      const response = await request(app)
        .delete(`/harvests/${mockHarvestId}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(403);
    });
  });
});
