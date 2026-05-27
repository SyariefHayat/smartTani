'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, ShoppingBag, Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SalesReportSummary } from './types';

interface SalesReportStatsProps {
  summary: SalesReportSummary;
}

export function SalesReportStats({ summary }: SalesReportStatsProps) {
  const isPositiveGrowth = summary.growth >= 0;

  const stats = [
    {
      title: 'Total Penjualan',
      value: `Rp ${summary.totalSales.toLocaleString('id-ID')}`,
      description: 'Keseluruhan penjualan terkonfirmasi',
      icon: DollarSign,
      colorClass: 'text-emerald-500',
    },
    {
      title: 'Pertumbuhan',
      value: `${isPositiveGrowth ? '+' : ''}${summary.growth}%`,
      description: isPositiveGrowth
        ? 'Peningkatan dibanding bln lalu'
        : 'Penurunan dibanding bln lalu',
      icon: TrendingUp,
      colorClass: isPositiveGrowth ? 'text-emerald-500' : 'text-rose-500',
    },
    {
      title: 'Rata-rata Transaksi',
      value: `Rp ${summary.avgTransaction.toLocaleString('id-ID')}`,
      description: 'Nilai rata-rata per pesanan selesai',
      icon: ShoppingBag,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Item Terjual',
      value: `${summary.itemsSold.toLocaleString('id-ID')} unit`,
      description: 'Volume produk terkirim',
      icon: Package,
      colorClass: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">{stat.title}</CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl"
                title={String(stat.value)}
              >
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium text-slate-600">
                <Icon className={cn('size-4 shrink-0', stat.colorClass)} />
                <span className="truncate">{stat.description}</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
