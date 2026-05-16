'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Box, ThermometerSnowflake, Package, AlertTriangle } from 'lucide-react';
import { Warehouse } from './types';

interface WarehouseStatsProps {
  warehouses: Warehouse[];
}

export function WarehouseStats({ warehouses }: WarehouseStatsProps) {
  const avgCapacity =
    warehouses.length > 0
      ? Math.round(warehouses.reduce((acc, w) => acc + w.capacity, 0) / warehouses.length)
      : 0;

  const stats = [
    {
      label: 'Total Gudang',
      value: warehouses.length,
      icon: Box,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pendingin (Active)',
      value: warehouses.filter((w) => w.type === 'Cold Storage' && w.status === 'active').length,
      icon: ThermometerSnowflake,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
    },
    {
      label: 'Rata-rata Kapasitas',
      value: `${avgCapacity}%`,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Hampir Penuh',
      value: warehouses.filter((w) => w.capacity >= 90).length,
      icon: AlertTriangle,
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
