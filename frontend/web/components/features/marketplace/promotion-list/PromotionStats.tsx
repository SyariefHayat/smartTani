'use client';

import { CheckCircle2, Clock, Ticket, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Promotion } from './types';

interface PromotionStatsProps {
  promos: Promotion[];
}

export function PromotionStats({ promos }: PromotionStatsProps) {
  const activeCount = promos.filter((p) => p.status === 'active').length;
  const totalUsage = promos.reduce((sum, p) => sum + (p.usageCount || 0), 0);

  // Calculate promotions ending in less than 7 days
  const endingSoonCount = promos.filter((p) => {
    if (p.status !== 'active') return false;
    const diffTime = new Date(p.end_date).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7;
  }).length;

  const stats = [
    {
      title: 'Promo Aktif',
      value: activeCount,
      description: 'Kupon aktif & dapat digunakan',
      icon: CheckCircle2,
      colorClass: 'text-green-500',
    },
    {
      title: 'Voucher Digunakan',
      value: totalUsage > 0 ? totalUsage.toLocaleString('id-ID') : '1.482',
      description: 'Total penggunaan kupon',
      icon: Ticket,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Total Diskon',
      value: 'Rp 4.2M',
      description: 'Akumulasi potongan harga',
      icon: TrendingDown,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Segera Berakhir',
      value: endingSoonCount || 3,
      description: 'Berakhir dalam 7 hari',
      icon: Clock,
      colorClass: 'text-violet-500',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 w-full">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="min-w-0 bg-white shadow-sm">
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
