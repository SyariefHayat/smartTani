import prisma from '../lib/prisma';
import { Prisma } from '@prisma/client';

class UserRepository {
  async getUserGrowth(params: { from_date?: string; to_date?: string; granularity: 'day' | 'week' | 'month' }) {
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

    const whereClause = conditions.length > 0 
      ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` 
      : Prisma.empty;

    const query = Prisma.sql`
      SELECT 
        DATE_TRUNC(${dateTrunc}, created_at) as date, 
        role, 
        COUNT(*)::int as count 
      FROM users 
      ${whereClause}
      GROUP BY date, role 
      ORDER BY date ASC, role ASC
    `;

    const result = await prisma.$queryRaw<Array<{ date: Date; role: string; count: number }>>(query);

    return result;
  }
}

export default new UserRepository();
