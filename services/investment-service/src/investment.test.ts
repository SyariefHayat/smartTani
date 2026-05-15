import request from 'supertest';
import express from 'express';
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

// Mock env
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
app.use('/investments', investmentRoutes);
app.use(errorHandlerMiddleware);

const UUID = '123e4567-e89b-12d3-a456-426614174000';

describe('POST /investments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create investment and return 201', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      farmer_id: 'petani-1',
      status: 'open_for_funding',
      funding_needed: 50000000,
      funding_raised: 0,
      projected_roi_percent: 15,
    });

    (investmentRepository.createWithFundingUpdate as jest.Mock).mockResolvedValue({
      investment: {
        id: 'inv-1',
        investor_id: 'investor-1',
        proposal_id: UUID,
        amount: 5000000,
        platform_fee_percent: 1.0,
        projected_return: 5692500,
        status: 'paid',
      },
      proposal: { id: UUID, funding_raised: 5000000, funding_needed: 50000000 },
      isFullyFunded: false,
    });

    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 5000000 });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('paid');
    expect(investmentRepository.createWithFundingUpdate).toHaveBeenCalled();
    expect(MessageBroker.publish).not.toHaveBeenCalled(); // not fully funded
  });

  it('should publish proposal.funded event when fully funded', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      farmer_id: 'petani-1',
      title: 'Kebun Jagung',
      status: 'open_for_funding',
      funding_needed: 5000000,
      funding_raised: 4000000,
      projected_roi_percent: 15,
    });

    (investmentRepository.createWithFundingUpdate as jest.Mock).mockResolvedValue({
      investment: {
        id: 'inv-2',
        investor_id: 'investor-1',
        proposal_id: UUID,
        amount: 1000000,
        status: 'paid',
      },
      proposal: { id: UUID, funding_raised: 5000000, funding_needed: 5000000 },
      isFullyFunded: true,
    });

    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 1000000 });

    expect(res.status).toBe(201);
    expect(MessageBroker.publish).toHaveBeenCalledWith(
      'smarttani.events',
      'proposal.funded',
      expect.objectContaining({ id: UUID })
    );
  });

  it('should return 400 if proposal is not open_for_funding', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      farmer_id: 'petani-1',
      status: 'draft',
      funding_needed: 50000000,
      funding_raised: 0,
    });

    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 5000000 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVESTMENT_001');
    expect(investmentRepository.createWithFundingUpdate).not.toHaveBeenCalled();
  });

  it('should return 400 if amount < MIN_INVESTMENT_AMOUNT', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      farmer_id: 'petani-1',
      status: 'open_for_funding',
      funding_needed: 50000000,
      funding_raised: 0,
      projected_roi_percent: 15,
    });

    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 50000 }); // below 100k

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVESTMENT_002');
    expect(investmentRepository.createWithFundingUpdate).not.toHaveBeenCalled();
  });

  it('should return 422 if amount exceeds remaining funding (over-fund)', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue({
      id: UUID,
      farmer_id: 'petani-1',
      status: 'open_for_funding',
      funding_needed: 10000000,
      funding_raised: 9500000,
      projected_roi_percent: 15,
    });

    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 1000000 }); // remaining is 500k

    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe('INVESTMENT_003');
    expect(investmentRepository.createWithFundingUpdate).not.toHaveBeenCalled();
  });

  it('should return 403 if user is not an investor', async () => {
    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani')
      .send({ proposalId: UUID, amount: 5000000 });

    expect(res.status).toBe(403);
    expect(proposalRepository.findById).not.toHaveBeenCalled();
  });

  it('should return 404 if proposal not found', async () => {
    (proposalRepository.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ proposalId: UUID, amount: 5000000 });

    expect(res.status).toBe(404);
    expect(investmentRepository.createWithFundingUpdate).not.toHaveBeenCalled();
  });
});

describe('GET /investments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return investor portfolio with summary', async () => {
    (investmentRepository.findByInvestor as jest.Mock).mockResolvedValue({
      investments: [
        {
          id: 'inv-1',
          investor_id: 'investor-1',
          proposal_id: UUID,
          amount: 5000000,
          projected_return: 5692500,
          status: 'paid',
          proposal: { id: UUID, title: 'Kebun Jagung', commodity: 'Jagung', status: 'open_for_funding' },
        },
        {
          id: 'inv-2',
          investor_id: 'investor-1',
          proposal_id: 'prop-2',
          amount: 3000000,
          projected_return: 3415500,
          status: 'paid',
          proposal: { id: 'prop-2', title: 'Kebun Padi', commodity: 'Padi', status: 'fully_funded' },
        },
      ],
      summary: {
        total_invested: 8000000,
        total_projected_return: 9108000,
        total_investments: 2,
      },
    });

    const res = await request(app)
      .get('/investments')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.meta.total_invested).toBe(8000000);
    expect(res.body.meta.total_projected_return).toBe(9108000);
    expect(res.body.meta.total_investments).toBe(2);
    // Verify it was called with the correct investor ID (ownership check)
    expect(investmentRepository.findByInvestor).toHaveBeenCalledWith('investor-1');
  });

  it('should return empty portfolio for new investor', async () => {
    (investmentRepository.findByInvestor as jest.Mock).mockResolvedValue({
      investments: [],
      summary: {
        total_invested: 0,
        total_projected_return: 0,
        total_investments: 0,
      },
    });

    const res = await request(app)
      .get('/investments')
      .set('X-User-Id', 'investor-new')
      .set('X-User-Role', 'investor');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
    expect(res.body.meta.total_investments).toBe(0);
  });

  it('should return 403 if user is not an investor', async () => {
    const res = await request(app)
      .get('/investments')
      .set('X-User-Id', 'petani-1')
      .set('X-User-Role', 'petani');

    expect(res.status).toBe(403);
    expect(investmentRepository.findByInvestor).not.toHaveBeenCalled();
  });
});

describe('PATCH /investments/:id/complete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete investment and return 200', async () => {
    (investmentRepository.findById as jest.Mock).mockResolvedValue({
      id: 'inv-1',
      investor_id: 'investor-1',
      proposal_id: UUID,
      amount: 5000000,
      status: 'paid',
    });

    (investmentRepository.completeInvestment as jest.Mock).mockResolvedValue({
      id: 'inv-1',
      investor_id: 'investor-1',
      proposal_id: UUID,
      amount: 5000000,
      status: 'completed',
      actual_return: 5750000,
      completed_at: new Date(),
    });

    const res = await request(app)
      .patch('/investments/inv-1/complete')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin')
      .send({ actualReturnPercent: 15 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('completed');
    expect(MessageBroker.publish).toHaveBeenCalledWith(
      'smarttani.events',
      'investment.completed',
      expect.any(Object)
    );
  });

  it('should return 400 if investment is already completed', async () => {
    (investmentRepository.findById as jest.Mock).mockResolvedValue({
      id: 'inv-1',
      status: 'completed',
    });

    const res = await request(app)
      .patch('/investments/inv-1/complete')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin')
      .send({ actualReturnPercent: 15 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVESTMENT_004');
  });

  it('should return 403 if user is not an admin', async () => {
    const res = await request(app)
      .patch('/investments/inv-1/complete')
      .set('X-User-Id', 'investor-1')
      .set('X-User-Role', 'investor')
      .send({ actualReturnPercent: 15 });

    expect(res.status).toBe(403);
  });

  it('should return 404 if investment not found', async () => {
    (investmentRepository.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .patch('/investments/inv-1/complete')
      .set('X-User-Id', 'admin-1')
      .set('X-User-Role', 'admin')
      .send({ actualReturnPercent: 15 });

    expect(res.status).toBe(404);
  });
});
