import prisma from '../lib/prisma';

class FarmerAnalyticsRepository {
  async getFarmerMetrics(farmerId: string) {
    const [
      totalSales,
      totalOrders,
      topProducts
    ] = await Promise.all([
      // Total penjualan (sum subtotal dari order items milik petani ini)
      prisma.orderItem.aggregate({
        _sum: { subtotal: true },
        where: { 
          farmer_id: farmerId,
          order: { status: { in: ['completed', 'delivered', 'shipped', 'paid'] } }
        }
      }),

      // Total order (count order unik yang berisi item petani ini)
      prisma.order.count({
        where: {
          items: {
            some: { farmer_id: farmerId }
          },
          status: { in: ['completed', 'delivered', 'shipped', 'paid'] }
        }
      }),

      // Produk terlaris (group by product_id, sum quantity)
      prisma.orderItem.groupBy({
        by: ['product_id'],
        _sum: { quantity: true, subtotal: true },
        where: { 
          farmer_id: farmerId,
          order: { status: { in: ['completed', 'delivered', 'shipped', 'paid'] } }
        },
        orderBy: {
          _sum: { quantity: 'desc' }
        },
        take: 5
      })
    ]);

    return {
      total_sales: Number(totalSales._sum.subtotal || 0),
      total_orders: totalOrders,
      top_products: topProducts.map(p => ({
        product_id: p.product_id,
        total_quantity: Number(p._sum.quantity || 0),
        total_revenue: Number(p._sum.subtotal || 0)
      }))
    };
  }
}

export default new FarmerAnalyticsRepository();
