'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Box, ThermometerSnowflake, Package, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
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
      title: 'Total Gudang',
      value: warehouses.length,
      description: 'Gudang terdaftar dalam sistem',
      icon: Box,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Pendingin (Active)',
      value: warehouses.filter((w) => w.type === 'Cold Storage' && w.status === 'active').length,
      description: 'Cold storage beroperasi',
      icon: ThermometerSnowflake,
      colorClass: 'text-cyan-500',
    },
    {
      title: 'Rata-rata Kapasitas',
      value: `${avgCapacity}%`,
      description: 'Tingkat keterisian rata-rata',
      icon: Package,
      colorClass: 'text-purple-500',
    },
    {
      title: 'Hampir Penuh',
      value: warehouses.filter((w) => w.capacity >= 90).length,
      description: 'Kapasitas di atas 90%',
      icon: AlertTriangle,
      colorClass: 'text-rose-500',
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
                className="truncate text-xl font-semibold lg:text-2xl"
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
