import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

class OrderAnalyticsRepository {
  async getOrderVolumeAndValue(params: { from_date?: string; to_date?: string; granularity: 'day' | 'week' | 'month' }) {
    const { from_date, to_date, granularity } = params;

    let dateTrunc: string;
    switch (granularity) {
      case 'week':
        dateTrunc = 'week';
        break;
      case 'month':
        dateTrunc = 'month';
        break;
      case 'day':
      default:
        dateTrunc = 'day';
    }

    const conditions: Prisma.Sql[] = [];
    if (from_date) {
      conditions.push(Prisma.sql`created_at >= ${from_date}::timestamptz`);
    }
    if (to_date) {
      conditions.push(Prisma.sql`created_at <= ${to_date}::timestamptz`);
    }
    // Only count successful orders
    conditions.push(Prisma.sql`status IN ('completed', 'delivered', 'shipped', 'paid')`);

    const whereClause = Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}`;

    const query = Prisma.sql`
      SELECT 
        DATE_TRUNC(${dateTrunc}, created_at) as date, 
        COUNT(*)::int as volume,
        SUM(total_amount)::float as value
      FROM orders 
      ${whereClause}
      GROUP BY date 
      ORDER BY date ASC
    `;

    const result = await prisma.$queryRaw<Array<{ date: Date; volume: number; value: number }>>(query);

    return result;
  }
}

export default new OrderAnalyticsRepository();
