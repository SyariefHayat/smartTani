import { logger } from '../../../../shared/utils/logger';
import investmentRepository from '../repositories/investment.repository';
import proposalRepository from '../repositories/proposal.repository';
import MessageBroker from '../lib/broker';
import { env } from '../config/env';

class InvestmentService {
  async createInvestment(investorId: string, proposalId: string, amount: number) {
    // 1. Fetch proposal with admin role to bypass RBAC
    const proposal = await proposalRepository.findById(proposalId, { id: 'system', role: 'admin' });

    if (!proposal) {
      const error: any = new Error('Proposal tidak ditemukan');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    // 2. Validate proposal status
    if (proposal.status !== 'open_for_funding') {
      const error: any = new Error('Proposal tidak tersedia untuk pendanaan');
      error.statusCode = 400;
      error.code = 'INVESTMENT_001';
      throw error;
    }

    // 3. Validate minimum investment amount
    const minAmount = env.MIN_INVESTMENT_AMOUNT;
    if (amount < minAmount) {
      const error: any = new Error(`Jumlah investasi minimal Rp ${minAmount.toLocaleString('id-ID')}`);
      error.statusCode = 422;
      error.code = 'INVESTMENT_002';
      throw error;
    }

    // 4. Validate no over-funding
    const fundingNeeded = Number(proposal.funding_needed);
    const fundingRaised = Number(proposal.funding_raised);
    const remaining = fundingNeeded - fundingRaised;

    if (amount > remaining) {
      const error: any = new Error(`Jumlah investasi melebihi sisa kebutuhan dana (Rp ${remaining.toLocaleString('id-ID')})`);
      error.statusCode = 422;
      error.code = 'INVESTMENT_003';
      throw error;
    }

    // 5. Calculate platform fee and projected return
    const platformFeePercent = env.INVESTMENT_FEE_PERCENT;
    const roiPercent = proposal.projected_roi_percent;
    const projectedReturn = amount * (1 + roiPercent / 100) * (1 - platformFeePercent / 100);

    // 6. Create investment atomically
    const result = await investmentRepository.createWithFundingUpdate({
      investorId,
      proposalId,
      amount,
      platformFeePercent,
      projectedReturn,
      fundingNeeded,
    });

    // 7. Publish INVESTMENT_CREATED event
    try {
      await MessageBroker.publish('smarttani.events', 'investment.created', {
        investmentId: result.investment.id,
        investorId,
        proposalId,
        amount,
        investedAt: new Date(),
      });
    } catch (error) {
      logger.error('Failed to publish investment.created event', error);
    }

    // 8. If fully funded, publish event
    if (result.isFullyFunded) {
      try {
        await MessageBroker.publish('smarttani.events', 'proposal.funded', {
          id: proposalId,
          farmer_id: proposal.farmer_id,
          title: proposal.title,
          funding_needed: fundingNeeded,
          funded_at: new Date(),
        });
      } catch (error) {
        logger.error('Failed to publish proposal.funded event', error);
      }
    }

    return result.investment;
  }

  async completeInvestment(id: string, actualReturnPercent: number) {
    const investment = await investmentRepository.findById(id);

    if (!investment) {
      const error: any = new Error('Investasi tidak ditemukan');
      error.statusCode = 404;
      error.code = 'NOT_FOUND';
      throw error;
    }

    if (investment.status === 'completed') {
      const error: any = new Error('Investasi sudah selesai');
      error.statusCode = 400;
      error.code = 'INVESTMENT_004';
      throw error;
    }

    const actualReturn = Number(investment.amount) * (1 + actualReturnPercent / 100);

    const updatedInvestment = await investmentRepository.completeInvestment(id, actualReturn);

    try {
      await MessageBroker.publish('smarttani.events', 'investment.completed', {
        id: updatedInvestment.id,
        investor_id: updatedInvestment.investor_id,
        proposal_id: updatedInvestment.proposal_id,
        amount: Number(updatedInvestment.amount),
        actual_return: actualReturn,
        actual_return_percent: actualReturnPercent,
        completed_at: updatedInvestment.completed_at,
      });
    } catch (error) {
      logger.error('Failed to publish investment.completed event', error);
    }

    return updatedInvestment;
  }

  async getPortfolio(investorId: string) {
    return await investmentRepository.findByInvestor(investorId);
  }
}

export default new InvestmentService();
