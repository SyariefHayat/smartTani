'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Sprout, TrendingUp, Award, Leaf } from 'lucide-react';
import { FarmerHarvest } from './types';

interface HarvestStatsProps {
  harvests: FarmerHarvest[];
}

export function HarvestStats({ harvests }: HarvestStatsProps) {
  const totalYield = harvests.reduce((acc, h) => acc + Number(h.quantity || 0), 0);
  const goodQualityCount = harvests.filter((h) => ['A', 'B'].includes(h.quality_grade)).length;
  const uniqueCrops = new Set(harvests.map((h) => h.crop_name)).size;

  const stats = [
    {
      label: 'Total Catatan Panen',
      value: harvests.length,
      icon: Sprout,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Hasil Panen (kg)',
      value: totalYield.toLocaleString('id-ID'),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Kualitas Baik (Grade A/B)',
      value: goodQualityCount,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Jenis Tanaman',
      value: uniqueCrops,
      icon: Leaf,
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
