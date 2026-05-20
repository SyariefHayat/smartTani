'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Map, Sprout, Tractor, LayoutDashboard } from 'lucide-react';
import { FarmerLand } from './types';

interface LandStatsProps {
  lands: FarmerLand[];
}

export function LandStats({ lands }: LandStatsProps) {
  const totalArea = lands.reduce((acc, l) => acc + (l.area_ha || 0), 0);
  const activeCount = lands.filter((l) => l.status === 'active').length;
  const uniqueCrops = new Set(lands.map((l) => l.current_crop).filter(Boolean)).size;

  const stats = [
    {
      label: 'Total Lahan',
      value: lands.length,
      icon: LayoutDashboard,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
    },
    {
      label: 'Total Luas',
      value: `${totalArea.toFixed(2)} Ha`,
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Lahan Aktif',
      value: activeCount,
      icon: Tractor,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Variasi Komoditas',
      value: uniqueCrops,
      icon: Sprout,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-slate-200 shadow-sm transition-all hover:shadow-md"
        >
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`rounded-xl p-3 ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
