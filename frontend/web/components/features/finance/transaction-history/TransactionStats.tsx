'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownLeft, Wallet, ReceiptText } from 'lucide-react';
import { Transaction } from './types';

interface TransactionStatsProps {
  transactions: Transaction[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'Income' && t.status === 'Completed')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense' && t.status === 'Completed')
    .reduce((acc, t) => acc + t.amount, 0);

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
      value: formatCurrency(totalIncome),
      icon: ArrowUpRight,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Pengeluaran',
      value: formatCurrency(totalExpense),
      icon: ArrowDownLeft,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Saldo Tersedia',
      value: formatCurrency(totalIncome - totalExpense),
      icon: Wallet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Jumlah Transaksi',
      value: transactions.length,
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
