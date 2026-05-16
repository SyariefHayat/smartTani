'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, ShoppingCart, CheckCircle2, XCircle } from 'lucide-react';
import { FarmerOrder } from '../farmer-orders/types';

interface SalesHistoryStatsProps {
  orders: FarmerOrder[];
}

export function SalesHistoryStats({ orders }: SalesHistoryStatsProps) {
  const totalRevenue = orders
    .filter((o) => o.status === 'delivered' || o.status === 'completed')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const stats = [
    {
      label: 'Total Pendapatan',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Total Transaksi',
      value: orders.length,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Penjualan Berhasil',
      value: orders.filter((o) => o.status === 'delivered' || o.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Transaksi Batal',
      value: orders.filter((o) => o.status === 'cancelled').length,
      icon: XCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-slate-100 shadow-sm overflow-hidden border-l-4 border-l-green-500"
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-xl p-3 ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
