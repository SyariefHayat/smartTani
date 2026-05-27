'use client';

import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Ruler, Activity, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FarmingStats } from './types';

interface FarmingReportStatsProps {
  summary: FarmingStats;
}

export function FarmingReportStats({ summary }: FarmingReportStatsProps) {
  const stats = [
    {
      title: 'Luas Lahan Aktif',
      value: `${summary.totalLandArea.toLocaleString('id-ID')} Ha`,
      description: 'Total luas wilayah lahan produktif',
      icon: Ruler,
      colorClass: 'text-green-500',
    },
    {
      title: 'Tanaman Berjalan',
      value: `${summary.activeCropCount} Jenis`,
      description: 'Komoditas aktif di lahan',
      icon: Sprout,
      colorClass: 'text-blue-500',
    },
    {
      title: 'Skor Kesehatan Rata-rata',
      value: `${summary.averageHealthScore}/100`,
      description:
        summary.averageHealthScore >= 85
          ? 'Kondisi Sangat Baik'
          : summary.averageHealthScore >= 75
            ? 'Kondisi Baik'
            : summary.averageHealthScore > 0
              ? 'Kondisi Cukup'
              : 'Tidak ada data',
      icon: Activity,
      colorClass: 'text-purple-500',
    },
    {
      title: 'Total Hasil Panen',
      value: `${summary.projectedHarvestVal.toLocaleString('id-ID')} Unit`,
      description: 'Akumulasi volume panen',
      icon: TrendingUp,
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
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl"
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
