'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Receipt, Wallet, CalendarDays, Store } from 'lucide-react';
import { PurchaseRecord } from './types';

interface PurchaseStatsProps {
  purchases: PurchaseRecord[];
}

export function PurchaseStats({ purchases }: PurchaseStatsProps) {
  const totalExpenditure = purchases.reduce((acc, p) => acc + p.total_cost, 0);
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
      label: 'Total Catatan',
      value: purchases.length,
      icon: Receipt,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Pengeluaran',
      value: formattedTotal,
      icon: Wallet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      label: 'Bulan Ini',
      value: purchasesThisMonth,
      icon: CalendarDays,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      label: 'Supplier',
      value: uniqueSuppliers,
      icon: Store,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-none shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className={`rounded-xl p-3 ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
