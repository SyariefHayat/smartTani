import prisma from '../lib/prisma';

class InvestmentAnalyticsRepository {
  async getInvestmentMetrics() {
    const [
      disbursedFunds,
      activeProposals,
      completedProposals,
      averageROI
    ] = await Promise.all([
      // Total dana tersalurkan (sum amount dari investments status paid + completed)
      prisma.investment.aggregate({
        _sum: { amount: true },
        where: { status: { in: ['paid', 'completed'] } }
      }),

      // Jumlah proposal aktif (open_for_funding, fully_funded)
      prisma.proposal.count({
        where: { status: { in: ['open_for_funding', 'fully_funded'] } }
      }),

      // Proposal selesai (completed)
      prisma.proposal.count({
        where: { status: 'completed' }
      }),

      // Rata-rata ROI (average projected_roi_percent dari all proposals)
      prisma.proposal.aggregate({
        _avg: { projected_roi_percent: true }
      })
    ]);

    return {
      total_disbursed: Number(disbursedFunds._sum.amount || 0),
      active_proposals: activeProposals,
      completed_proposals: completedProposals,
      average_roi: Number(averageROI._avg.projected_roi_percent || 0)
    };
  }
}

export default new InvestmentAnalyticsRepository();
