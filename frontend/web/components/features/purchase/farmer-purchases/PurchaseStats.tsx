'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Clock, Truck, CheckCircle2 } from 'lucide-react';
import { FarmerPurchase } from './types';

interface PurchaseStatsProps {
  purchases: FarmerPurchase[];
}

export function PurchaseStats({ purchases }: PurchaseStatsProps) {
  const stats = [
    {
      label: 'Total Pembelian',
      value: purchases.length,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Menunggu',
      value: purchases.filter((p) => p.status === 'pending').length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Dikirim',
      value: purchases.filter((p) => p.status === 'shipped').length,
      icon: Truck,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Selesai',
      value: purchases.filter((p) => p.status === 'completed' || p.status === 'delivered').length,
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
