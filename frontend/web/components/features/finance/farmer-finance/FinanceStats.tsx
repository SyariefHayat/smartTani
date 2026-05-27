'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, TrendingUp, Clock, Percent, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FinanceSummary } from './types';

interface FinanceStatsProps {
  summary: FinanceSummary;
}

export function FinanceStats({ summary }: FinanceStatsProps) {
  const isPositiveGrowth = summary.earningsChangePercent >= 0;

  const stats = [
    {
      title: 'Saldo Saat Ini',
      value: `Rp ${summary.currentBalance.toLocaleString('id-ID')}`,
      description: 'Saldo yang siap untuk ditarik',
      icon: Wallet,
      colorClass: 'text-emerald-500',
    },
    {
      title: 'Total Penghasilan',
      value: `Rp ${summary.totalEarnings.toLocaleString('id-ID')}`,
      description: 'Akumulasi seluruh pendapatan',
      icon: TrendingUp,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Saldo Tertunda',
      value: `Rp ${summary.pendingBalance.toLocaleString('id-ID')}`,
      description: 'Transaksi dalam proses kliring',
      icon: Clock,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Pertumbuhan Bulan Ini',
      value: `${isPositiveGrowth ? '+' : ''}${summary.earningsChangePercent}%`,
      description: isPositiveGrowth
        ? 'Peningkatan dibanding bln lalu'
        : 'Penurunan dibanding bln lalu',
      icon: isPositiveGrowth ? ArrowUpRight : ArrowDownRight,
      colorClass: isPositiveGrowth ? 'text-emerald-500' : 'text-rose-500',
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
                className="truncate text-xl font-bold lg:text-2xl text-slate-800"
                title={String(stat.value)}
              >
                {stat.value}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium text-slate-500">
                <Icon className={cn('size-4 shrink-0', stat.colorClass)} />
                <span className="truncate text-xs">{stat.description}</span>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
