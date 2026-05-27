'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, Sprout, Tractor, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FarmerLand } from './types';

interface LandStatsProps {
  lands: FarmerLand[];
}

export function LandStats({ lands }: LandStatsProps) {
  const totalArea = lands.reduce((acc, l) => acc + Number(l.area_ha || 0), 0);
  const activeCount = lands.filter((l) => l.status === 'active').length;
  const uniqueCrops = new Set(lands.map((l) => l.current_crop).filter(Boolean)).size;

  const stats = [
    {
      title: 'Total Lahan',
      value: lands.length,
      description: 'Aset bidang lahan terdata',
      icon: LayoutDashboard,
      colorClass: 'text-slate-500',
    },
    {
      title: 'Total Luas',
      value: `${totalArea.toFixed(2)} Ha`,
      description: 'Akumulasi luas wilayah lahan',
      icon: Map,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Lahan Aktif',
      value: activeCount,
      description: 'Lahan dalam masa budidaya',
      icon: Tractor,
      colorClass: 'text-emerald-500',
    },
    {
      title: 'Variasi Komoditas',
      value: uniqueCrops,
      description: 'Jenis variasi tanaman aktif',
      icon: Sprout,
      colorClass: 'text-amber-500',
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
