import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

class DistributorAnalyticsRepository {
  async getDistributorMetrics(distributorId: string) {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalSpending,
      activeOrders,
      totalOrders,
      avgOrderValue,
      monthlySpending,
      prevMonthSpending,
      uniqueSuppliersRaw,
      uniqueProductsRaw,
      topProductsRaw,
      topSuppliersRaw,
    ] = await Promise.all([
      // total_spending
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: distributorId,
          status: { in: ['completed', 'delivered'] },
        },
      }),

      // active_orders
      prisma.order.count({
        where: {
          buyer_id: distributorId,
          status: { notIn: ['completed', 'delivered', 'cancelled'] },
        },
      }),

      // total_orders
      prisma.order.count({
        where: {
          buyer_id: distributorId,
          status: { in: ['completed', 'delivered'] },
        },
      }),

      // avg_order_value
      prisma.order.aggregate({
        _avg: { total_amount: true },
        where: {
          buyer_id: distributorId,
          status: { in: ['completed', 'delivered'] },
        },
      }),

      // monthly_spending (this month)
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: distributorId,
          status: { in: ['completed', 'delivered'] },
          created_at: { gte: startOfCurrentMonth },
        },
      }),

      // prev_month_spending (last month)
      prisma.order.aggregate({
        _sum: { total_amount: true },
        where: {
          buyer_id: distributorId,
          status: { in: ['completed', 'delivered'] },
          created_at: { gte: startOfPrevMonth, lte: endOfPrevMonth },
        },
      }),

      // unique_suppliers
      prisma.orderItem.groupBy({
        by: ['farmer_id'],
        where: {
          order: {
            buyer_id: distributorId,
            status: { in: ['completed', 'delivered'] },
          },
        },
      }),

      // unique_products_bought
      prisma.orderItem.groupBy({
        by: ['product_id'],
        where: {
          order: {
            buyer_id: distributorId,
            status: { in: ['completed', 'delivered'] },
          },
        },
      }),

      // top_products raw
      prisma.orderItem.groupBy({
        by: ['product_id'],
        _sum: { quantity: true },
        where: {
          order: {
            buyer_id: distributorId,
            status: { in: ['completed', 'delivered'] },
          },
        },
        orderBy: {
          _sum: { quantity: 'desc' },
        },
        take: 3,
      }),

      // top_suppliers raw
      prisma.orderItem.groupBy({
        by: ['farmer_id'],
        _sum: { subtotal: true },
        _count: { order_id: true },
        where: {
          order: {
            buyer_id: distributorId,
            status: { in: ['completed', 'delivered'] },
          },
        },
        orderBy: {
          _sum: { subtotal: 'desc' },
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
        buy_count: topProductsRaw.length,
        total_qty: Number(p._sum.quantity || 0),
        image: product?.image || '/images/products/default.jpg',
      };
    });

    // Fetch supplier names
    const farmerIds = topSuppliersRaw.map((s) => s.farmer_id);
    const farmers = await prisma.user.findMany({
      where: { id: { in: farmerIds } },
    });

    const top_suppliers = topSuppliersRaw.map((s) => {
      const farmer = farmers.find((f) => f.id === s.farmer_id);
      return {
        farmer_id: s.farmer_id,
        name: farmer?.full_name || 'Petani Mitra',
        total_transactions: s._count.order_id,
        total_amount: Number(s._sum.subtotal || 0),
      };
    });

    const monthly = Number(monthlySpending._sum.total_amount || 0);
    const prev = Number(prevMonthSpending._sum.total_amount || 0);
    const spending_change_percent = prev === 0 ? 0 : ((monthly - prev) / prev) * 100;

    return {
      total_spending: Number(totalSpending._sum.total_amount || 0),
      monthly_spending: monthly,
      spending_change_percent: Math.round(spending_change_percent * 10) / 10,
      active_orders: activeOrders,
      total_orders: totalOrders,
      unique_suppliers: uniqueSuppliersRaw.length,
      unique_products_bought: uniqueProductsRaw.length,
      avg_order_value: Math.round(Number(avgOrderValue._avg.total_amount || 0)),
      top_products,
      top_suppliers,
    };
  }

  async getSpendingChart(distributorId: string, from_date?: string, to_date?: string) {
    const conditions: Prisma.Sql[] = [];
    conditions.push(Prisma.sql`o.buyer_id = ${distributorId}::uuid`);
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
        DATE_TRUNC('month', o.created_at) as month,
        SUM(o.total_amount)::float as spending,
        COUNT(o.id)::integer as orders_count
      FROM orders o
      ${whereClause}
      GROUP BY month
      ORDER BY month ASC
    `;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await prisma.$queryRaw<any[]>(query);

    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'Mei',
      'Jun',
      'Jul',
      'Agu',
      'Sep',
      'Okt',
      'Nov',
      'Des',
    ];

    return result.map((r) => {
      const date = new Date(r.month);
      return {
        month: monthNames[date.getMonth()],
        spending: r.spending || 0,
        orders_count: r.orders_count || 0,
      };
    });
  }
}

export default new DistributorAnalyticsRepository();
