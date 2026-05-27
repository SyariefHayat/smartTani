'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckCircle2, ShoppingBag, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Supplier } from './types';

interface SupplierStatsProps {
  suppliers: Supplier[];
}

export function SupplierStats({ suppliers }: SupplierStatsProps) {
  const activeCount = suppliers.filter((s) => s.status === 'active').length;
  const categoriesCount = new Set(suppliers.map((s) => s.category)).size;
  const totalOrders = suppliers.reduce((acc, s) => acc + (s.totalOrders || 0), 0);

  const stats = [
    {
      title: 'Total Supplier',
      value: suppliers.length,
      description: 'Pemasok terdaftar dalam sistem',
      icon: Users,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Supplier Aktif',
      value: activeCount,
      description: 'Pemasok berstatus aktif',
      icon: CheckCircle2,
      colorClass: 'text-emerald-500',
    },
    {
      title: 'Kategori Pasokan',
      value: categoriesCount,
      description: 'Jenis kategori komoditas',
      icon: ShoppingBag,
      colorClass: 'text-purple-500',
    },
    {
      title: 'Total Transaksi',
      value: `${totalOrders} Kali`,
      description: 'Akumulasi seluruh transaksi',
      icon: Truck,
      colorClass: 'text-amber-500',
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
