'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, TrendingUp, Award, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
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
      title: 'Total Catatan Panen',
      value: harvests.length,
      description: 'Total aktivitas panen',
      icon: Sprout,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Total Hasil Panen',
      value: `${totalYield.toLocaleString('id-ID')} kg`,
      description: 'Akumulasi tonase produksi',
      icon: TrendingUp,
      colorClass: 'text-emerald-500',
    },
    {
      title: 'Kualitas Baik',
      value: `${goodQualityCount} Record`,
      description: 'Hasil panen Grade A/B',
      icon: Award,
      colorClass: 'text-amber-500',
    },
    {
      title: 'Jenis Komoditas',
      value: uniqueCrops,
      description: 'Ragam varietas tanaman',
      icon: Leaf,
      colorClass: 'text-purple-500',
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
