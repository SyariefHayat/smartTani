'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Wallet, ReceiptText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionStatsProps {
  currentBalance: number;
  totalEarnings: number;
  totalTransactions: number;
}

export function TransactionStats({
  currentBalance,
  totalEarnings,
  totalTransactions,
}: TransactionStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const platformFee = totalEarnings - currentBalance;

  const stats = [
    {
      title: 'Total Pemasukan',
      value: formatCurrency(totalEarnings),
      description: 'Pendapatan kotor penjualan',
      icon: ArrowUpRight,
      colorClass: 'text-emerald-500',
    },
    {
      title: 'Biaya Platform (2%)',
      value: formatCurrency(platformFee >= 0 ? platformFee : 0),
      description: 'Potongan administrasi layanan',
      icon: ArrowDownLeft,
      colorClass: 'text-rose-500',
    },
    {
      title: 'Saldo Tersedia',
      value: formatCurrency(currentBalance),
      description: 'Saldo bersih siap ditarik',
      icon: Wallet,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Volume Transaksi',
      value: `${totalTransactions} Record`,
      description: 'Aktivitas transaksi tercatat',
      icon: ReceiptText,
      colorClass: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="min-w-0 border border-slate-200 bg-white">
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
