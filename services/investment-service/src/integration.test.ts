import request from 'supertest';
import express from 'express';
import proposalRoutes from './routes/proposal.routes';
import investmentRoutes from './routes/investment.routes';
import { errorHandlerMiddleware } from '../../../shared/middleware/errorHandler';
import proposalRepository from './repositories/proposal.repository';
import investmentRepository from './repositories/investment.repository';
import MessageBroker from './lib/broker';

jest.mock('./repositories/proposal.repository');
jest.mock('./repositories/investment.repository');
jest.mock('./lib/broker', () => ({
  publish: jest.fn(),
  connect: jest.fn(),
}));

jest.mock('./config/env', () => ({
  env: {
    NODE_ENV: 'test',
    PORT: 3004,
    MIN_INVESTMENT_AMOUNT: 100000,
    INVESTMENT_FEE_PERCENT: 1.0,
  },
}));

const app = express();
app.use(express.json());
app.use('/proposals', proposalRoutes);
app.use('/investments', investmentRoutes);
app.use(errorHandlerMiddleware);

const UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('Investment Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should follow the full flow: create -> submit -> approve -> invest -> fully funded', async () => {
    // 1. Create Proposal (Petani)
    const proposalData = {
      title: 'Kebun Jagung Modern',
      commodity: 'Jagung',
      land_area_ha: 2.5,
      location: {
        province: 'Jawa Barat',
        city: 'Bandung',
        district: 'Lembang',
        full_address: 'Jl. Pertanian No. 1',
      },
      funding_needed: 5000000,
      projected_roi_percent: 15,
      duration_days: 120,
      harvest_date_estimated: '2026-10-15T00:00:00.000Z',
      description: 'Deskripsi proposal yang sangat panjang untuk memenuhi validasi minimal 20 karakter.',
      use_of_funds: 'Penggunaan dana untuk bibit dan pupuk berkualitas tinggi.',
      risk_notes: 'Catatan risiko terkait cuaca dan hama.',
    };

    (proposalRepository.create as jest.Mock).mockResolvedValue({
      id: UUID,
      farmer_id: 'petani-1',
      ...proposalData,
      status: 'draft',
    });

    const createRes = await request(app)
      .post('/proposals')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani')
      .send(proposalData);

    expect(createRes.status).toBe(201);
    expect(createRes.body.data.status).toBe('draft');

    // 2. Submit Proposal (Petani)
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      farmer_id: 'petani-1',
      status: 'draft',
    });
    (proposalRepository.update as jest.Mock).mockResolvedValue({
      id: UUID,
      status: 'submitted',
    });

    const submitRes = await request(app)
      .post(`/proposals/${UUID}/submit`)
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani');

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.data.status).toBe('submitted');

    // 3. Approve Proposal (Admin)
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      status: 'submitted',
    });
    (proposalRepository.update as jest.Mock).mockResolvedValue({
      id: UUID,
      status: 'open_for_funding',
      funding_needed: 5000000,
      funding_raised: 0,
      projected_roi_percent: 15,
    });

    const approveRes = await request(app)
      .post(`/proposals/${UUID}/approve`)
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin');

    expect(approveRes.status).toBe(200);
    expect(approveRes.body.data.status).toBe('open_for_funding');

    // 4. Invest (Investor)
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      status: 'open_for_funding',
      funding_needed: 5000000,
      funding_raised: 0,
      projected_roi_percent: 15,
    });
    (investmentRepository.createWithFundingUpdate as jest.Mock).mockResolvedValue({
      investment: { id: 'inv-1', status: 'paid', amount: 5000000 },
      proposal: { id: UUID, status: 'fully_funded', funding_raised: 5000000 },
      isFullyFunded: true,
    });

    const investRes = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 5000000 });

    expect(investRes.status).toBe(201);
    expect(investRes.body.data.status).toBe('paid');
    expect(MessageBroker.publish).toHaveBeenCalledWith(
      'smarttani.events',
      'proposal.funded',
      expect.any(Object)
    );
  });

  it('should prevent investor from seeing draft proposals', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue(null); // RBAC in repo returns null for forbidden status

    const res = await request(app)
      .get(`/proposals/${UUID}`)
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor');

    expect(res.status).toBe(404);
  });

  it('should return 422 if amount is below minimum (Rp 100.000)', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      status: 'open_for_funding',
      funding_needed: 5000000,
      funding_raised: 0,
    });

    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 50000 });

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVESTMENT_002');
  });

  it('should return 422 if amount exceeds remaining funding', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      status: 'open_for_funding',
      funding_needed: 1000000,
      funding_raised: 950000,
    });

    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 100000 }); // remaining is 50,000

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVESTMENT_003');
  });
});
