import request from 'supertest';
import express from 'express';
import { CreateProposalInput } from './schemas/proposal.schema';
import proposalRoutes from './routes/proposal.routes';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import proposalRepository from './repositories/proposal.repository';
import MessageBroker from './lib/broker';

// Mock the repository
jest.mock('./repositories/proposal.repository');
jest.mock('./lib/broker', () => ({
  publish: jest.fn(),
  connect: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use('/proposals', proposalRoutes);
app.use(errorHandlerMiddleware);

describe('POST /proposals', () => {
  const mockInput: CreateProposalInput = {
    title: 'Kebun Jagung Modern',
    commodity: 'Jagung',
    land_area_ha: 2.5,
    location: {
      province: 'Jawa Barat',
      city: 'Bandung',
      district: 'Lembang',
      full_address: 'Jl. Pertanian No. 1',
    },
    funding_needed: 50000000,
    projected_roi_percent: 15.5,
    duration_days: 120,
    harvest_date_estimated: '2026-10-15T00:00:00.000Z',
    description: 'Proyek ini bertujuan untuk membangun...',
    use_of_funds: 'Dana akan digunakan untuk bibit dan pupuk...',
    risk_notes: 'Risiko utama adalah cuaca buruk...',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create proposal with status draft', async () => {
    (proposalRepository.create as jest.Mock).mockResolvedValue({
      id: 'prop-1',
      farmer_id: 'petani-1',
      ...mockInput,
      status: 'draft',
    });

    const res = await request(app)
      .post('/proposals')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani')
      .send(mockInput);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('draft');
    expect(proposalRepository.create).toHaveBeenCalledWith('petani-1', mockInput);
  });

  it('should reject if role is not petani', async () => {
    const res = await request(app)
      .post('/proposals')
      .set('X-User-Id', 'buyer-1')
      .set('X-User-Role', 'buyer')
      .send(mockInput);

    expect(res.status).toBe(403);
    expect(proposalRepository.create).not.toHaveBeenCalled();
  });

  it('should return 400 if validation fails', async () => {
    const invalidInput = { ...mockInput, title: 'A' }; // min length 5

    const res = await request(app)
      .post('/proposals')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani')
      .send(invalidInput);

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('COMMON_006');
    expect(proposalRepository.create).not.toHaveBeenCalled();
  });
});

describe('GET /proposals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return proposals for investor (only open_for_funding)', async () => {
    (proposalRepository.findAll as jest.Mock).mockResolvedValue({
      data: [{ id: '1', status: 'open_for_funding' }],
      meta: { total: 1, page: 1, limit: 20, total_pages: 1 },
    });

    const res = await request(app)
      .get('/proposals')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data[0].status).toBe('open_for_funding');
    expect(proposalRepository.findAll).toHaveBeenCalledWith(
      {},
      { page: 1, limit: 20 },
      { id: 'investor-1', role: 'investor', email: undefined, full_name: undefined }
    );
  });
});

describe('GET /proposals/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return proposal detail with funding_raised', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      status: 'open_for_funding',
      funding_needed: 100000,
      funding_raised: 50000,
      funding_percentage: 50,
    });

    const res = await request(app)
      .get('/proposals/123e4567-e89b-12d3-a456-426614174000')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.funding_raised).toBe(50000);
    expect(res.body.data.funding_percentage).toBe(50);
  });

  it('should return 404 if proposal not found or forbidden', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get('/proposals/123e4567-e89b-12d3-a456-426614174000')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor');

    expect(res.status).toBe(404);
  });
});

describe('PATCH /proposals/:id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update proposal if status is draft and user is owner', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      status: 'draft',
    });

    (proposalRepository.update as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      title: 'Updated Title',
    });

    const res = await request(app)
      .patch('/proposals/123e4567-e89b-12d3-a456-426614174000')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani')
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(proposalRepository.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', { title: 'Updated Title' });
  });

  it('should return 400 if proposal is already submitted', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      status: 'submitted',
    });

    const res = await request(app)
      .patch('/proposals/123e4567-e89b-12d3-a456-426614174000')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani')
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('PROPOSAL_001');
    expect(proposalRepository.update).not.toHaveBeenCalled();
  });

  it('should return 404 if user is not the owner', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .patch('/proposals/123e4567-e89b-12d3-a456-426614174000')
      .set('X-User-Id', 'petani-2')
      .set('X-User-Role', 'petani')
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(404);
    expect(proposalRepository.update).not.toHaveBeenCalled();
  });
});

describe('POST /proposals/:id/submit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should submit proposal and publish event if status is draft', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      title: 'Kebun Jagung',
      status: 'draft',
    });

    (proposalRepository.update as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      title: 'Kebun Jagung',
      status: 'submitted',
    });

    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/submit')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(proposalRepository.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', { status: 'submitted' });
    expect(MessageBroker.publish).toHaveBeenCalledWith(
      'smarttani.events',
      'proposal.submitted',
      expect.objectContaining({ id: '123e4567-e89b-12d3-a456-426614174000', status: 'submitted' })
    );
  });

  it('should return 400 if proposal is not draft', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      status: 'submitted',
    });

    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/submit')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('PROPOSAL_002');
    expect(proposalRepository.update).not.toHaveBeenCalled();
  });
});

describe('POST /proposals/:id/approve', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should approve proposal and publish event if status is submitted', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      title: 'Kebun Jagung',
      status: 'submitted',
    });

    (proposalRepository.update as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      title: 'Kebun Jagung',
      status: 'open_for_funding',
      approved_at: new Date(),
    });

    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/approve')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(proposalRepository.update).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000', expect.objectContaining({ status: 'open_for_funding' }));
    expect(MessageBroker.publish).toHaveBeenCalledWith(
      'smarttani.events',
      'proposal.approved',
      expect.objectContaining({ id: '123e4567-e89b-12d3-a456-426614174000', status: 'open_for_funding' })
    );
  });

  it('should return 400 if proposal is not submitted', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      status: 'draft',
    });

    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/approve')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('PROPOSAL_003');
    expect(proposalRepository.update).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not admin', async () => {
    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/approve')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani');

    expect(res.status).toBe(403);
    expect(proposalRepository.findById).not.toHaveBeenCalled();
  });
});

describe('POST /proposals/:id/reject', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject proposal with reason and publish event', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      title: 'Kebun Jagung',
      status: 'submitted',
    });

    (proposalRepository.update as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      title: 'Kebun Jagung',
      status: 'rejected',
      admin_notes: 'Lahan terlalu kecil untuk proposal ini',
    });

    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/reject')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin')
      .send({ reason: 'Lahan terlalu kecil untuk proposal ini' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(proposalRepository.update).toHaveBeenCalledWith(
      '123e4567-e89b-12d3-a456-426614174000',
      expect.objectContaining({ status: 'rejected', admin_notes: 'Lahan terlalu kecil untuk proposal ini' })
    );
    expect(MessageBroker.publish).toHaveBeenCalledWith(
      'smarttani.events',
      'proposal.rejected',
      expect.objectContaining({
        id: '123e4567-e89b-12d3-a456-426614174000',
        status: 'rejected',
        reason: 'Lahan terlalu kecil untuk proposal ini',
      })
    );
  });

  it('should return 400 if proposal is not submitted', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: '123e4567-e89b-12d3-a456-426614174000',
      farmer_id: 'petani-1',
      status: 'draft',
    });

    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/reject')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin')
      .send({ reason: 'Lahan terlalu kecil untuk proposal ini' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('PROPOSAL_004');
  });

  it('should return 422 if reason is missing', async () => {
    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/reject')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin')
      .send({});

    expect(res.status).toBe(422);
    expect(proposalRepository.findById).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not admin', async () => {
    const res = await request(app)
      .post('/proposals/123e4567-e89b-12d3-a456-426614174000/reject')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani')
      .send({ reason: 'Lahan terlalu kecil untuk proposal ini' });

    expect(res.status).toBe(403);
    expect(proposalRepository.findById).not.toHaveBeenCalled();
  });
});
