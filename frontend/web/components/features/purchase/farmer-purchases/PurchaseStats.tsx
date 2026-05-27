'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt, Wallet, CalendarDays, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PurchaseRecord } from './types';

interface PurchaseStatsProps {
  purchases: PurchaseRecord[];
}

export function PurchaseStats({ purchases }: PurchaseStatsProps) {
  const totalExpenditure = purchases.reduce((acc, p) => acc + Number(p.total_cost || 0), 0);
  const formattedTotal = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(totalExpenditure);

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const purchasesThisMonth = purchases.filter((p) => {
    const d = new Date(p.purchase_date);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  const uniqueSuppliers = new Set(purchases.map((p) => p.supplier_name)).size;

  const stats = [
    {
      title: 'Total Catatan',
      value: purchases.length,
      description: 'Semua catatan pembelian',
      icon: Receipt,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Total Pengeluaran',
      value: formattedTotal,
      description: 'Akumulasi seluruh biaya',
      icon: Wallet,
      colorClass: 'text-emerald-500',
    },
    {
      title: 'Bulan Ini',
      value: purchasesThisMonth,
      description: 'Catatan bulan berjalan',
      icon: CalendarDays,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Supplier',
      value: uniqueSuppliers,
      description: 'Pemasok terdaftar',
      icon: Store,
      colorClass: 'text-violet-500',
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
