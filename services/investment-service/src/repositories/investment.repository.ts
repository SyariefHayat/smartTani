import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

class InvestmentRepository {
  /**
   * Create investment + atomically update funding_raised in a transaction.
   * Returns { investment, proposal, isFullyFunded }.
   */
  async createWithFundingUpdate(data: {
    investorId: string;
    proposalId: string;
    amount: number;
    platformFeePercent: number;
    projectedReturn: number;
    fundingNeeded: number;
  }) {
    return await prisma.$transaction(async (tx) => {
      // 1. Create the investment record
      const investment = await tx.investment.create({
        data: {
          investor_id: data.investorId,
          proposal_id: data.proposalId,
          amount: data.amount,
          platform_fee_percent: data.platformFeePercent,
          projected_return: data.projectedReturn,
          status: 'paid',
        },
      });

      // 2. Atomically increment funding_raised using raw SQL to prevent race conditions
      await tx.$executeRaw`
        UPDATE proposals
        SET funding_raised = funding_raised + ${data.amount}::decimal,
            updated_at = NOW()
        WHERE id = ${data.proposalId}::uuid
      `;

      // 3. Re-fetch the proposal to check if fully funded
      const proposal = await tx.proposal.findUniqueOrThrow({
        where: { id: data.proposalId },
      });

      const fundingRaised = Number(proposal.funding_raised);
      const fundingNeeded = Number(proposal.funding_needed);

      // 4. Strict check to prevent over-funding (race condition protection)
      if (fundingRaised > fundingNeeded) {
        const error: any = new Error('Investasi melebihi sisa kebutuhan dana');
        error.statusCode = 422;
        error.code = 'INVESTMENT_003';
        throw error;
      }

      const isFullyFunded = fundingRaised >= fundingNeeded;

      // 5. If fully funded, update status
      if (isFullyFunded) {
        await tx.proposal.update({
          where: { id: data.proposalId },
          data: { status: 'fully_funded' },
        });
      }

      return { investment, proposal, isFullyFunded };
    });
  }

  async findById(id: string) {
    return await prisma.investment.findUnique({
      where: { id },
      include: { proposal: true },
    });
  }

  async completeInvestment(id: string, actualReturn: number) {
    return await prisma.$transaction(async (tx) => {
      const investment = await tx.investment.update({
        where: { id },
        data: {
          status: 'completed',
          actual_return: actualReturn,
          completed_at: new Date(),
        },
        include: { proposal: true },
      });

      // Update proposal status if all its investments are completed
      // For MVP, we might just update the proposal status to completed 
      // when the first investment is completed or handle it specifically.
      // Q1 PRD says: Update proposal status ke completed
      await tx.proposal.update({
        where: { id: investment.proposal_id },
        data: { status: 'completed' },
      });

      return investment;
    });
  }

  async findByInvestor(investorId: string) {
    const investments = await prisma.investment.findMany({
      where: { investor_id: investorId },
      include: {
        proposal: {
          select: {
            id: true,
            title: true,
            commodity: true,
            status: true,
            funding_needed: true,
            funding_raised: true,
            projected_roi_percent: true,
            duration_days: true,
            harvest_date_estimated: true,
          },
        },
      },
      orderBy: { invested_at: 'desc' },
    });

    const totalInvested = investments.reduce((sum, inv) => sum + Number(inv.amount), 0);
    const totalProjectedReturn = investments.reduce((sum, inv) => sum + Number(inv.projected_return), 0);
    const totalActualReturn = investments.reduce((sum, inv) => sum + (inv.actual_return ? Number(inv.actual_return) : 0), 0);

    return {
      investments,
      summary: {
        total_invested: totalInvested,
        total_projected_return: totalProjectedReturn,
        total_actual_return: totalActualReturn,
        total_investments: investments.length,
      },
    };
  }
}

export default new InvestmentRepository();
