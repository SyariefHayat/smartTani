import request from 'supertest';
import { app } from './index';
import prisma from './lib/prisma';
import { signAccessToken } from '../../../shared/utils/jwt';
import { env } from './config/env';

jest.mock('./lib/prisma', () => ({
  __esModule: true,
  default: {
    farmLand: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('Land API', () => {
  const mockFarmerId = '123e4567-e89b-12d3-a456-426614174000';
  const mockLandId = '123e4567-e89b-12d3-a456-426614174001';
  const mockToken = signAccessToken(
    { userId: mockFarmerId, role: 'petani', email: 'farmer@test.com' },
    env.JWT_SECRET,
    '1h'
  );

  const validLand = {
    name: 'Sawah Utama',
    location_province: 'Jawa Barat',
    location_city: 'Cianjur',
    location_district: 'Cugenang',
    full_address: 'Jl. Raya Cugenang No. 123',
    area_ha: 2.5,
    soil_type: 'Lempung',
    status: 'active',
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('POST /lands', () => {
    it('should create a land record successfully', async () => {
      (prisma.farmLand.create as jest.Mock).mockResolvedValue({
        id: mockLandId,
        farmer_id: mockFarmerId,
        ...validLand,
      });

      const response = await request(app)
        .post('/lands')
        .set('Authorization', `Bearer ${mockToken}`)
        .send(validLand);

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe(validLand.name);
    });

    it('should return 401 if unauthorized', async () => {
      const response = await request(app).post('/lands').send(validLand);
      expect(response.status).toBe(401);
    });
  });

  describe('GET /lands', () => {
    it('should list lands for a farmer', async () => {
      const mockLands = [{ id: '1', ...validLand, farmer_id: mockFarmerId }];
      (prisma.farmLand.findMany as jest.Mock).mockResolvedValue(mockLands);

      const response = await request(app).get('/lands').set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('PATCH /lands/:id', () => {
    it('should update land if owner', async () => {
      (prisma.farmLand.findUnique as jest.Mock).mockResolvedValue({
        id: mockLandId,
        farmer_id: mockFarmerId,
      });
      (prisma.farmLand.update as jest.Mock).mockResolvedValue({
        id: mockLandId,
        name: 'Sawah Updated',
      });

      const response = await request(app)
        .patch(`/lands/${mockLandId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ name: 'Sawah Updated' });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('Sawah Updated');
    });

    it('should return 403 if not owner', async () => {
      (prisma.farmLand.findUnique as jest.Mock).mockResolvedValue({
        id: mockLandId,
        farmer_id: 'other-farmer-id',
      });

      const response = await request(app)
        .patch(`/lands/${mockLandId}`)
        .set('Authorization', `Bearer ${mockToken}`)
        .send({ name: 'Sawah Updated' });

      expect(response.status).toBe(403);
    });
  });

  describe('DELETE /lands/:id', () => {
    it('should delete land if owner', async () => {
      (prisma.farmLand.findUnique as jest.Mock).mockResolvedValue({
        id: mockLandId,
        farmer_id: mockFarmerId,
      });
      (prisma.farmLand.delete as jest.Mock).mockResolvedValue({
        id: mockLandId,
      });

      const response = await request(app)
        .delete(`/lands/${mockLandId}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
    });
  });
});
