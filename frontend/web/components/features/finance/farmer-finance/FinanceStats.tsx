'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, Clock, ArrowDownToLine } from 'lucide-react';
import { FinanceSummary } from './types';

interface FinanceStatsProps {
  summary: FinanceSummary;
}

export function FinanceStats({ summary }: FinanceStatsProps) {
  const stats = [
    {
      label: 'Saldo Saat Ini',
      value: `Rp ${summary.currentBalance.toLocaleString('id-ID')}`,
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Penghasilan',
      value: `Rp ${summary.totalEarnings.toLocaleString('id-ID')}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Saldo Tertunda',
      value: `Rp ${summary.pendingBalance.toLocaleString('id-ID')}`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Pertumbuhan (Bulan Ini)',
      value: `${summary.earningsChangePercent >= 0 ? '+' : ''}${summary.earningsChangePercent}%`,
      icon: ArrowDownToLine,
      color: summary.earningsChangePercent >= 0 ? 'text-green-600' : 'text-rose-600',
      bgColor: summary.earningsChangePercent >= 0 ? 'bg-green-100' : 'bg-rose-100',
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
