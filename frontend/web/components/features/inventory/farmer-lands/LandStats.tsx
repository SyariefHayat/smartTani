'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Map, Sprout, Tractor, Calendar } from 'lucide-react';
import { FarmerLand } from './types';

interface LandStatsProps {
  lands: FarmerLand[];
}

export function LandStats({ lands }: LandStatsProps) {
  const totalArea = lands.reduce((acc, l) => acc + l.areaHa, 0);
  const cultivatingCount = lands.filter((l) => l.status === 'cultivating').length;

  const stats = [
    {
      label: 'Total Luas Lahan',
      value: `${totalArea} Ha`,
      icon: Map,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Lahan Terolah',
      value: cultivatingCount,
      icon: Tractor,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Jenis Tanaman',
      value: new Set(lands.map((l) => l.activeCrop?.name).filter(Boolean)).size,
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Estimasi Panen (Bulan Ini)',
      value: 0, // Placeholder
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
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
