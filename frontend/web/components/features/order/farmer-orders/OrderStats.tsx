'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Clock, PackageCheck, CheckCircle2 } from 'lucide-react';
import { FarmerOrder } from './types';

interface OrderStatsProps {
  orders: FarmerOrder[];
}

export function OrderStats({ orders }: OrderStatsProps) {
  const stats = [
    {
      label: 'Total Pesanan',
      value: orders.length,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Perlu Konfirmasi',
      value: orders.filter((o) => o.status === 'paid').length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Dalam Proses',
      value: orders.filter((o) => ['confirmed', 'processing'].includes(o.status)).length,
      icon: PackageCheck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Selesai',
      value: orders.filter((o) => o.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
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
