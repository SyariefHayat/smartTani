'use client';

import { DollarSign, ShoppingCart, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FarmerOrder } from '../farmer-orders/types';

interface SalesHistoryStatsProps {
  orders: FarmerOrder[];
  isLoading?: boolean;
}

export function SalesHistoryStats({ orders, isLoading }: SalesHistoryStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="min-w-0">
            <CardHeader className="gap-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-7 w-28" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full items-center gap-1">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <Skeleton className="h-3.5 w-32" />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status === 'delivered' || o.status === 'completed')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const stats = [
    {
      title: 'Total Pendapatan',
      value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
      description: 'Penjualan berhasil & dikirim',
      icon: DollarSign,
      colorClass: 'text-green-500',
    },
    {
      title: 'Total Transaksi',
      value: orders.length,
      description: 'Selesai & dibatalkan',
      icon: ShoppingCart,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Penjualan Berhasil',
      value: orders.filter((o) => o.status === 'delivered' || o.status === 'completed').length,
      description: 'Pesanan sampai tujuan',
      icon: CheckCircle2,
      colorClass: 'text-emerald-500',
    },
    {
      title: 'Transaksi Batal',
      value: orders.filter((o) => o.status === 'cancelled').length,
      description: 'Pesanan dibatalkan',
      icon: XCircle,
      colorClass: 'text-rose-500',
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
