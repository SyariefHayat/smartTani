import prisma from '../lib/prisma';

class InvestorAnalyticsRepository {
  async getInvestorMetrics(investorId: string) {
    const [
      investmentSummary,
      portfolioBreakdown
    ] = await Promise.all([
      // Total invested, total projected return, total actual return
      prisma.investment.aggregate({
        _sum: { 
          amount: true,
          projected_return: true,
          actual_return: true
        },
        where: { 
          investor_id: investorId,
          status: { in: ['paid', 'completed'] }
        }
      }),

      // Portfolio breakdown (group by commodity if available, otherwise by status)
      prisma.investment.groupBy({
        by: ['status'],
        _sum: { amount: true },
        _count: { id: true },
        where: { investor_id: investorId }
      })
    ]);

    // Additional query for breakdown by commodity since we need join/include which groupBy doesn't support directly for relations in simple way
    // For Q1 we can just get all investments and do manual grouping or keep it simple
    const investmentsWithCommodity = await prisma.investment.findMany({
      where: { investor_id: investorId },
      include: { proposal: { select: { commodity: true } } }
    });

    const commodityBreakdown: Record<string, number> = {};
    investmentsWithCommodity.forEach(inv => {
      const comm = inv.proposal.commodity || 'Lainnya';
      commodityBreakdown[comm] = (commodityBreakdown[comm] || 0) + Number(inv.amount);
    });

    return {
      total_invested: Number(investmentSummary._sum.amount || 0),
      total_projected_return: Number(investmentSummary._sum.projected_return || 0),
      total_actual_return: Number(investmentSummary._sum.actual_return || 0),
      status_breakdown: portfolioBreakdown.map(b => ({
        status: b.status,
        count: b._count.id,
        total_amount: Number(b._sum.amount || 0)
      })),
      commodity_breakdown: Object.entries(commodityBreakdown).map(([commodity, amount]) => ({
        commodity,
        amount
      }))
    };
  }
}

export default new InvestorAnalyticsRepository();
