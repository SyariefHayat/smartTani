import prisma from '../lib/prisma';

class InvestorAnalyticsRepository {
  async getInvestorMetrics(investorId: string) {
    const [investmentSummary, portfolioBreakdown] = await Promise.all([
      // Total invested, total projected return, total actual return
      prisma.investment.aggregate({
        _sum: {
          amount: true,
          projected_return: true,
          actual_return: true,
        },
        where: {
          investor_id: investorId,
          status: { in: ['paid', 'completed'] },
        },
      }),

      // Portfolio breakdown (group by status)
      prisma.investment.groupBy({
        by: ['status'],
        _sum: { amount: true },
        _count: { id: true },
        where: { investor_id: investorId },
      }),
    ]);

    // Additional query for breakdown by commodity
    const investmentsWithCommodity = await prisma.investment.findMany({
      where: { investor_id: investorId },
      include: { proposal: { select: { commodity: true } } },
    });

    const commodityBreakdown: Record<string, number> = {};
    investmentsWithCommodity.forEach((inv) => {
      const comm = inv.proposal.commodity || 'Lainnya';
      commodityBreakdown[comm] = (commodityBreakdown[comm] || 0) + Number(inv.amount);
    });

    const activeInvestmentsCount = portfolioBreakdown.find((b) => b.status === 'paid')?._count.id || 0;
    const completedInvestmentsCount = portfolioBreakdown.find((b) => b.status === 'completed')?._count.id || 0;

    return {
      total_invested: Number(investmentSummary._sum.amount || 0),
      total_projected_return: Number(investmentSummary._sum.projected_return || 0),
      total_actual_return: Number(investmentSummary._sum.actual_return || 0),
      projected_return: Number(investmentSummary._sum.projected_return || 0),
      actual_return: Number(investmentSummary._sum.actual_return || 0),
      active_investments_count: activeInvestmentsCount,
      completed_investments_count: completedInvestmentsCount,
      status_breakdown: portfolioBreakdown.map((b) => ({
        status: b.status,
        count: b._count.id,
        total_amount: Number(b._sum.amount || 0),
      })),
      commodity_breakdown: Object.entries(commodityBreakdown).map(([commodity, amount]) => ({
        commodity,
        amount,
      })),
    };
  }

  async getROIChart(investorId: string, monthsCount: number = 6) {
    const cutoffDate = new Date();
    cutoffDate.setMonth(cutoffDate.getMonth() - monthsCount);

    const investments = await prisma.investment.findMany({
      where: {
        investor_id: investorId,
        invested_at: {
          gte: cutoffDate,
        },
        status: { in: ['paid', 'completed'] },
      },
      orderBy: {
        invested_at: 'asc',
      },
    });

    const monthsData: Record<string, { invested: number; return: number }> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    // Initialize the last monthsCount months
    for (let i = monthsCount - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = `${monthNames[d.getMonth()]}`;
      monthsData[label] = { invested: 0, return: 0 };
    }

    investments.forEach((inv) => {
      const date = new Date(inv.invested_at);
      const label = `${monthNames[date.getMonth()]}`;
      if (monthsData[label]) {
        monthsData[label].invested += Number(inv.amount);
        monthsData[label].return += Number(inv.actual_return || 0);
      }
    });

    return Object.entries(monthsData).map(([month, data]) => ({
      month,
      invested: data.invested,
      return: data.return,
    }));
  }

  async getInvestorFinance(investorId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [investments, totalCount, aggregateData] = await Promise.all([
      prisma.investment.findMany({
        where: { investor_id: investorId },
        include: {
          proposal: {
            select: {
              title: true,
            },
          },
        },
        orderBy: { invested_at: 'desc' },
        skip,
        take: limit,
      }),
      prisma.investment.count({
        where: { investor_id: investorId },
      }),
      prisma.investment.aggregate({
        _sum: {
          amount: true,
          projected_return: true,
          actual_return: true,
        },
        where: { investor_id: investorId },
      }),
    ]);

    const transactions = investments.map((inv) => ({
      id: inv.id,
      date: inv.invested_at.toISOString(),
      type: inv.status === 'completed' ? 'return' : 'investment',
      proposal_title: inv.proposal?.title || 'Lainnya',
      amount: Number(inv.amount),
      status: inv.status,
    }));

    return {
      total_invested: Number(aggregateData._sum.amount || 0),
      projected_return: Number(aggregateData._sum.projected_return || 0),
      actual_return: Number(aggregateData._sum.actual_return || 0),
      transactions,
      meta: {
        page,
        limit,
        total: totalCount,
      },
    };
  }
}

export default new InvestorAnalyticsRepository();
