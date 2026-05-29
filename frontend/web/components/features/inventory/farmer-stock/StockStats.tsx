'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingDown, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProductStock } from './types';

interface StockStatsProps {
  stocks: ProductStock[];
}

export function StockStats({ stocks }: StockStatsProps) {
  const lowStockCount = stocks.filter((s) => s.status === 'Low Stock').length;
  const outOfStockCount = stocks.filter((s) => s.status === 'Out of Stock').length;
  const totalValue = stocks.reduce((acc, s) => acc + s.quantity * s.pricePerUnit, 0);

  const stats = [
    {
      title: 'Total Item Stok',
      value: stocks.length,
      description: 'Semua komoditas terdaftar',
      icon: Layers,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Stok Menipis',
      value: lowStockCount,
      description: 'Mencapai batas minimum',
      icon: TrendingDown,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Habis / Kosong',
      value: outOfStockCount,
      description: 'Stok kosong di gudang',
      icon: AlertTriangle,
      colorClass: 'text-rose-500',
    },
    {
      title: 'Estimasi Nilai Stok',
      value: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(totalValue),
      description: 'Total valuasi persediaan',
      icon: Package,
      colorClass: 'text-emerald-500',
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
                className="truncate text-xl font-semibold lg:text-2xl"
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
