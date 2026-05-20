'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Wallet, ReceiptText } from 'lucide-react';
import { Transaction } from './types';

interface TransactionStatsProps {
  currentBalance: number;
  totalEarnings: number;
  pendingBalance: number;
  totalTransactions: number;
}

export function TransactionStats({
  currentBalance,
  totalEarnings,
  pendingBalance,
  totalTransactions,
}: TransactionStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      label: 'Total Pemasukan',
      value: formatCurrency(totalEarnings),
      icon: ArrowUpRight,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Platform Fee (2%)',
      value: formatCurrency(totalEarnings - currentBalance),
      icon: ArrowDownLeft,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Saldo Tersedia',
      value: formatCurrency(currentBalance),
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Jumlah Transaksi',
      value: totalTransactions,
      icon: ReceiptText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-full p-2 ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <h3 className="text-lg font-bold">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
