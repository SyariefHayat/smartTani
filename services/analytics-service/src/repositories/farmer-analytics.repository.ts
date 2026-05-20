import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

class FarmerAnalyticsRepository {
  async getFarmerMetrics(farmerId: string) {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const [
      totalRevenue,
      totalOrders,
      totalProducts,
      pendingOrders,
      monthlyRevenue,
      prevMonthRevenue,
      topProductsRaw,
    ] = await Promise.all([
      // total_revenue (delivered/completed)
      prisma.orderItem.aggregate({
        _sum: { subtotal: true },
        where: {
          farmer_id: farmerId,
          order: { status: { in: ['completed', 'delivered'] } },
        },
      }),

      // total_orders (any status that is not pending_payment)
      prisma.order.count({
        where: {
          items: { some: { farmer_id: farmerId } },
          status: { not: 'pending_payment' },
        },
      }),

      // total_products (active)
      prisma.product.count({
        where: { farmer_id: farmerId, status: 'active' },
      }),

      // pending_orders (paid, confirmed_seller)
      prisma.order.count({
        where: {
          items: { some: { farmer_id: farmerId } },
          status: { in: ['paid', 'confirmed_seller'] },
        },
      }),

      // monthly_revenue (this month)
      prisma.orderItem.aggregate({
        _sum: { subtotal: true },
        where: {
          farmer_id: farmerId,
          order: {
            status: { in: ['completed', 'delivered'] },
            created_at: { gte: startOfCurrentMonth },
          },
        },
      }),

      // prev_month_revenue (last month)
      prisma.orderItem.aggregate({
        _sum: { subtotal: true },
        where: {
          farmer_id: farmerId,
          order: {
            status: { in: ['completed', 'delivered'] },
            created_at: { gte: startOfPrevMonth, lte: endOfPrevMonth },
          },
        },
      }),

      // top_products raw
      prisma.orderItem.groupBy({
        by: ['product_id'],
        _sum: { quantity: true, subtotal: true },
        where: {
          farmer_id: farmerId,
          order: { status: { in: ['completed', 'delivered'] } },
        },
        orderBy: {
          _sum: { quantity: 'desc' },
        },
        take: 5,
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
        id: p.product_id,
        title: product?.title || 'Unknown Product',
        image: product?.image || null,
        sold_count: Number(p._sum.quantity || 0),
        revenue: Number(p._sum.subtotal || 0),
      };
    });

    const monthly = Number(monthlyRevenue._sum.subtotal || 0);
    const prev = Number(prevMonthRevenue._sum.subtotal || 0);
    const revenue_change_percent =
      prev === 0 ? (monthly > 0 ? 100 : 0) : ((monthly - prev) / prev) * 100;

    return {
      total_revenue: Number(totalRevenue._sum.subtotal || 0),
      total_orders: totalOrders,
      total_products: totalProducts,
      pending_orders: pendingOrders,
      monthly_revenue: monthly,
      prev_month_revenue: prev,
      revenue_change_percent: Math.round(revenue_change_percent * 10) / 10,
      top_products,
    };
  }

  async getRevenueChart(farmerId: string, from_date?: string, to_date?: string) {
    const conditions: Prisma.Sql[] = [];
    conditions.push(Prisma.sql`oi.farmer_id = ${farmerId}::uuid`);
    conditions.push(Prisma.sql`o.status IN ('completed', 'delivered')`);

    if (from_date) {
      conditions.push(Prisma.sql`o.created_at >= ${from_date}::timestamptz`);
    }
    if (to_date) {
      conditions.push(Prisma.sql`o.created_at <= ${to_date}::timestamptz`);
    }

    const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;

    // pendapatan = sum(subtotal), pengeluaran = estimasi platform fee per item (subtotal * percentage)
    const query = Prisma.sql`
      SELECT 
        DATE_TRUNC('day', o.created_at) as date,
        SUM(oi.subtotal)::float as pendapatan,
        (SUM(oi.subtotal) * 0.02)::float as pengeluaran
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      ${whereClause}
      GROUP BY date
      ORDER BY date ASC
    `;

    const result =
      await prisma.$queryRaw<Array<{ date: Date; pendapatan: number; pengeluaran: number }>>(query);

    return result.map((r) => ({
      date: r.date.toISOString().split('T')[0],
      pendapatan: r.pendapatan,
      pengeluaran: r.pengeluaran,
    }));
  }
}

export default new FarmerAnalyticsRepository();
