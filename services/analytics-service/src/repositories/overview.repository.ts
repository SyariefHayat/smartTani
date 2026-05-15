import prisma from '../lib/prisma';

class OverviewRepository {
  async getGlobalMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalGMV,
      todayGMV,
      activeUsers,
      todayOrders,
      disbursedInvestment,
      orderBreakdown,
      pendingUsers,
      pendingProposals
    ] = await Promise.all([
      // Total GMV (sum total_amount dari order status completed + delivered)
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: { status: { in: ['completed', 'delivered'] } }
      }),

      // Total GMV hari ini
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: { 
          status: { in: ['completed', 'delivered'] },
          created_at: { gte: today }
        }
      }),

      // Total user aktif
      prisma.user.count({
        where: { status: 'active' }
      }),

      // Total order hari ini
      prisma.order.count({
        where: { created_at: { gte: today } }
      }),

      // Total dana investasi tersalurkan (sum amount dari investments status active + completed)
      prisma.investment.aggregate({
        _sum: { amount: true },
        where: { status: { in: ['paid', 'completed'] } } // Based on prisma schema status values
      }),

      // Breakdown order per status
      prisma.order.groupBy({
        by: ['status'],
        _count: { id: true }
      }),

      // Pending users
      prisma.user.count({
        where: { status: 'pending_verification' }
      }),

      // Pending proposals
      prisma.proposal.count({
        where: { status: 'pending' }
      })
    ]);

    return {
      total_gmv: Number(totalGMV._sum.total_amount || 0),
      today_gmv: Number(todayGMV._sum.total_amount || 0),
      active_users: activeUsers,
      today_orders: todayOrders,
      disbursed_investment: Number(disbursedInvestment._sum.amount || 0),
      order_breakdown: orderBreakdown.reduce((acc: any, curr) => {
        acc[curr.status] = curr._count.id;
        return acc;
      }, {}),
      pending_users: pendingUsers,
      pending_proposals: pendingProposals
    };
  }
}

export default new OverviewRepository();
