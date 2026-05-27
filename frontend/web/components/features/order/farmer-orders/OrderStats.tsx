'use client';

import { ShoppingBag, Clock, PackageCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FarmerOrder } from './types';

interface OrderStatsProps {
  orders: FarmerOrder[];
  isLoading?: boolean;
}

export function OrderStats({ orders, isLoading }: OrderStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="min-w-0">
            <CardHeader className="gap-1">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-7 w-14" />
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

  const totalCount = orders.length;
  const pendingCount = orders.filter(
    (o) => o.status === 'paid' || o.status === 'pending_payment'
  ).length;
  const processingCount = orders.filter((o) =>
    ['confirmed', 'confirmed_seller', 'processing', 'shipped'].includes(o.status)
  ).length;
  const completedCount = orders.filter(
    (o) => o.status === 'completed' || o.status === 'delivered'
  ).length;

  const stats = [
    {
      title: 'Total Pesanan',
      value: totalCount,
      description: 'Semua pesanan masuk',
      icon: ShoppingBag,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Perlu Konfirmasi',
      value: pendingCount,
      description: 'Menunggu persetujuan Anda',
      icon: Clock,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Dalam Proses',
      value: processingCount,
      description: 'Pesanan sedang diproses',
      icon: PackageCheck,
      colorClass: 'text-violet-500',
    },
    {
      title: 'Selesai',
      value: completedCount,
      description: 'Transaksi diselesaikan',
      icon: CheckCircle2,
      colorClass: 'text-green-500',
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
