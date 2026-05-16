'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Sprout, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { FarmerHarvest } from './types';

interface HarvestStatsProps {
  harvests: FarmerHarvest[];
}

export function HarvestStats({ harvests }: HarvestStatsProps) {
  const completedHarvests = harvests.filter((h) => h.status === 'completed');
  const totalYield = completedHarvests.reduce((acc, h) => acc + (h.actualYield || 0), 0);
  const goodQualityCount = completedHarvests.filter((h) => ['A', 'B'].includes(h.quality)).length;
  const scheduledCount = harvests.filter((h) => h.status === 'scheduled').length;

  const stats = [
    {
      label: 'Total Panen Selesai',
      value: completedHarvests.length,
      icon: Sprout,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Total Hasil (kg)',
      value: totalYield.toLocaleString('id-ID'),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Kualitas Baik (A/B)',
      value: goodQualityCount,
      icon: Award,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Akan Datang',
      value: scheduledCount,
      icon: AlertCircle,
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
