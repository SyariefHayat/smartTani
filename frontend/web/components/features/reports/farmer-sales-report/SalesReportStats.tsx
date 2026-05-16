'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, ShoppingBag, Package } from 'lucide-react';
import { SalesReportSummary } from './types';

interface SalesReportStatsProps {
  summary: SalesReportSummary;
}

export function SalesReportStats({ summary }: SalesReportStatsProps) {
  const stats = [
    {
      label: 'Total Penjualan',
      value: `Rp ${summary.totalSales.toLocaleString('id-ID')}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Pertumbuhan',
      value: `+${summary.growth}%`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Rata-rata Transaksi',
      value: `Rp ${summary.avgTransaction.toLocaleString('id-ID')}`,
      icon: ShoppingBag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Item Terjual',
      value: summary.itemsSold.toLocaleString('id-ID'),
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
