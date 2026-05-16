'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import { Supplier } from './types';

interface SupplierStatsProps {
  suppliers: Supplier[];
}

export function SupplierStats({ suppliers }: SupplierStatsProps) {
  const stats = [
    {
      label: 'Total Supplier',
      value: suppliers.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Supplier Aktif',
      value: suppliers.filter((s) => s.status === 'active').length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Kategori Produk',
      value: new Set(suppliers.map((s) => s.category)).size,
      icon: ShoppingBag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Perlu Update',
      value: 0, // Placeholder
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
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
