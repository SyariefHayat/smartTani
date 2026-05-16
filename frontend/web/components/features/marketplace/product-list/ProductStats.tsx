'use client';

import { Boxes, CheckCircle2, Clock3, PackageX } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Product } from './types';

interface ProductStatsProps {
  products: Product[];
}

export function ProductStats({ products }: ProductStatsProps) {
  const activeProductsCount = products.filter((p) => p.status === 'Active').length;
  const closedProductsCount = products.filter((p) => p.status === 'Closed For Sale').length;
  const outOfStockProductsCount = products.filter((p) => p.status === 'Out Of Stock').length;

  const stats = [
    {
      title: 'Total Produk',
      value: products.length,
      description: 'Semua produk terdaftar',
      icon: Boxes,
      colorClass: 'text-slate-500',
    },
    {
      title: 'Produk Aktif',
      value: activeProductsCount,
      description: 'Produk siap dijual',
      icon: CheckCircle2,
      colorClass: 'text-green-500',
    },
    {
      title: 'Tutup Penjualan',
      value: closedProductsCount,
      description: 'Penjualan dihentikan',
      icon: Clock3,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Stok Habis',
      value: outOfStockProductsCount,
      description: 'Perlu restok segera',
      icon: PackageX,
      colorClass: 'text-rose-500',
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="min-w-0 shadow-none">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs uppercase tracking-wide">
                {stat.title}
              </CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
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
