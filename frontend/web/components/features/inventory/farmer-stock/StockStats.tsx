'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Package, AlertTriangle, TrendingDown, Layers } from 'lucide-react';
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
      label: 'Total Item Stok',
      value: stocks.length,
      icon: Layers,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Stok Menipis',
      value: lowStockCount,
      icon: TrendingDown,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Habis / Kosong',
      value: outOfStockCount,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Estimasi Nilai Stok',
      value: new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(totalValue),
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
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
              <h3 className="text-xl font-bold">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
