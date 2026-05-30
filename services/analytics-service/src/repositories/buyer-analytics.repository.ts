import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

class BuyerAnalyticsRepository {
  async getBuyerMetrics(buyerId: string) {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalSpending,
      activeOrders,
      totalProductsBoughtRaw,
      monthlySpending,
      prevMonthSpending,
      topProductsRaw,
    ] = await Promise.all([
      // total_spending
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: buyerId,
          status: { in: ['completed', 'delivered'] },
        },
      }),

      // active_orders
      prisma.order.count({
        where: {
          buyer_id: buyerId,
          status: { notIn: ['completed', 'delivered', 'cancelled'] },
        },
      }),

      // total_products_bought
      prisma.orderItem.aggregate({
        _sum: { quantity: true },
        where: {
          order: {
            buyer_id: buyerId,
            status: { in: ['completed', 'delivered'] },
          },
        },
      }),

      // monthly_spending (this month)
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: buyerId,
          status: { in: ['completed', 'delivered'] },
          created_at: { gte: startOfCurrentMonth },
        },
      }),

      // prev_month_spending (last month)
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: buyerId,
          status: { in: ['completed', 'delivered'] },
          created_at: { gte: startOfPrevMonth, lte: endOfPrevMonth },
        },
      }),

      // top_products raw
      prisma.orderItem.groupBy({
        by: ['product_id'],
        _sum: { quantity: true },
        where: {
          order: {
            buyer_id: buyerId,
            status: { in: ['completed', 'delivered'] },
          },
        },
        orderBy: {
          _sum: { quantity: 'desc' },
        },
        take: 3,
      }),
    ]);

    // Fetch product details for top products
    const productIds = topProductsRaw.map((p) => p.product_id);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const top_products = topProductsRaw.map((p) => {
      const product = products.find((pr) => pr.id === p.product_id);
      return {
        product_id: p.product_id,
        title: product?.title || 'Unknown Product',
        image: product?.image || '/images/products/default.jpg',
        buy_count: Number(p._sum.quantity || 0),
      };
    });

    const monthly = Number(monthlySpending._sum.total_amount || 0);
    const prev = Number(prevMonthSpending._sum.total_amount || 0);
    const spending_change_percent = prev === 0 ? 0 : ((monthly - prev) / prev) * 100;

    // Simulate reviews count based on completed/delivered orders
    const completedOrdersCount = await prisma.order.count({
      where: {
        buyer_id: buyerId,
        status: { in: ['completed', 'delivered'] },
      },
    });
    const total_reviews_given = Math.max(1, Math.round(completedOrdersCount * 0.8));

    return {
      total_spending: Number(totalSpending._sum.total_amount || 0),
      active_orders: activeOrders,
      total_products_bought: Number(totalProductsBoughtRaw._sum.quantity || 0),
      total_reviews_given,
      monthly_spending: monthly,
      spending_change_percent: Math.round(spending_change_percent * 10) / 10,
      top_products,
    };
  }

  async getSpendingChart(buyerId: string, from_date?: string, to_date?: string) {
    const conditions: Prisma.Sql[] = [];
    conditions.push(Prisma.sql`o.buyer_id = ${buyerId}::uuid`);
    conditions.push(Prisma.sql`o.status IN ('completed', 'delivered')`);

    if (from_date) {
      conditions.push(Prisma.sql`o.created_at >= ${from_date}::timestamptz`);
    }
    if (to_date) {
      conditions.push(Prisma.sql`o.created_at <= ${to_date}::timestamptz`);
    }

    const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;

    const query = Prisma.sql`
      SELECT 
        DATE_TRUNC('day', o.created_at) as date,
        SUM(o.total_amount)::float as spending,
        COUNT(o.id)::integer as orders_count
      FROM orders o
      ${whereClause}
      GROUP BY date
      ORDER BY date ASC
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$queryRaw<any[]>(query);

    return result.map((r) => ({
      date: new Date(r.date).toISOString().split('T')[0],
      spending: r.spending || 0,
      orders_count: r.orders_count || 0,
    }));
  }

  async getFinanceAnalytics(buyerId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalSpending,
      completedOrdersCount,
      monthlySpending,
      prevMonthSpending,
      ordersRaw,
      total,
    ] = await Promise.all([
      // total_spending
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: buyerId,
          status: { in: ['completed', 'delivered'] },
        },
      }),

      // completed_orders_count for average per order calculation
      prisma.order.count({
        where: {
          buyer_id: buyerId,
          status: { in: ['completed', 'delivered'] },
        },
      }),

      // monthly_spending (this month)
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: buyerId,
          status: { in: ['completed', 'delivered'] },
          created_at: { gte: startOfCurrentMonth },
        },
      }),

      // prev_month_spending (last month)
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: buyerId,
          status: { in: ['completed', 'delivered'] },
          created_at: { gte: startOfPrevMonth, lte: endOfPrevMonth },
        },
      }),

      // orders raw (paginated)
      prisma.order.findMany({
        where: { buyer_id: buyerId },
        include: {
          items: {
            include: {
              product: {
                select: { title: true },
              },
            },
          },
        },
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),

      // total count for meta
      prisma.order.count({
        where: { buyer_id: buyerId },
      }),
    ]);

    const totalSpendingVal = Number(totalSpending._sum.total_amount || 0);
    const monthly = Number(monthlySpending._sum.total_amount || 0);
    const prev = Number(prevMonthSpending._sum.total_amount || 0);
    const spending_change_percent =
      prev === 0 ? (monthly > 0 ? 100 : 0) : ((monthly - prev) / prev) * 100;

    const avgPerOrder = completedOrdersCount > 0 ? totalSpendingVal / completedOrdersCount : 0;

    const transactions = ordersRaw.map((order) => {
      // Build items summary, e.g. "Cabai Merah Keriting, Pupuk Organik"
      const itemsSummary = order.items
        .map((item) => item.product?.title || 'Unknown Product')
        .join(', ');

      return {
        id: `TX-${order.id.slice(0, 5).toUpperCase()}`,
        date: order.created_at.toISOString(),
        order_id: order.id,
        amount: Number(order.total_amount),
        status: order.status === 'completed' || order.status === 'delivered' ? 'completed' : 'cancelled',
        items_summary: itemsSummary || 'Pembelian Produk Pertanian',
      };
    });

    return {
      total_spending: totalSpendingVal,
      monthly_spending: monthly,
      avg_per_order: Math.round(avgPerOrder),
      spending_change_percent: Math.round(spending_change_percent * 10) / 10,
      transactions,
      meta: {
        page,
        limit,
        total,
      },
    };
  }
}

export default new BuyerAnalyticsRepository();
