'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { landService } from '@/services/land';
import { harvestService } from '@/services/harvest';
import { toast } from 'sonner';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';

import { FarmingReportHeader } from './FarmingReportHeader';
import { FarmingReportStats } from './FarmingReportStats';
import { FarmingTrendsChart } from './FarmingTrendsChart';
import { LandDistributionChart } from './LandDistributionChart';
import { RecentFarmingReports } from './RecentFarmingReports';
import { Skeleton } from '@/components/ui/skeleton';

export function FarmingReportsManagement() {
  // 1. Fetch Lands
  const {
    data: lands = [],
    isLoading: isLandsLoading,
    error: landsError,
  } = useQuery({
    queryKey: ['lands'],
    queryFn: async () => landService.getLands(),
  });

  // 2. Fetch Harvests
  const {
    data: harvests = [],
    isLoading: isHarvestsLoading,
    error: harvestsError,
  } = useQuery({
    queryKey: ['harvests'],
    queryFn: async () => harvestService.getHarvests(),
  });

  // Error notifications
  React.useEffect(() => {
    if (landsError) {
      toast.error('Gagal mengambil data lahan');
    }
  }, [landsError]);

  React.useEffect(() => {
    if (harvestsError) {
      toast.error('Gagal mengambil data hasil panen');
    }
  }, [harvestsError]);

  // 3. Compute Stats Summary
  const summary = React.useMemo(() => {
    const activeLands = lands.filter((l) => l.status === 'active');
    const totalLandArea = activeLands.reduce((sum, l) => sum + l.area_ha, 0);

    const activeCropsSet = new Set(activeLands.map((l) => l.current_crop).filter(Boolean));
    const activeCropCount = activeCropsSet.size;

    const qualityScores = harvests.map((h) => {
      if (h.quality_grade === 'A') return 95;
      if (h.quality_grade === 'B') return 80;
      return 65;
    });
    const averageHealthScore =
      qualityScores.length > 0
        ? Math.round(qualityScores.reduce((sum, s) => sum + s, 0) / qualityScores.length)
        : 0;

    const totalHarvestVal = harvests.reduce((sum, h) => sum + h.quantity, 0);

    return {
      totalLandArea,
      activeCropCount,
      averageHealthScore,
      projectedHarvestVal: totalHarvestVal,
    };
  }, [lands, harvests]);

  // 4. Compute 6-Month Trends
  const trends = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }).map((_, idx) => {
      const d = subMonths(new Date(), 5 - idx);
      return {
        name: format(d, 'MMM', { locale: id }),
        start: startOfMonth(d),
        end: endOfMonth(d),
      };
    });

    return last6Months.map((m) => {
      const monthlyHarvests = harvests.filter((h) => {
        const hDate = new Date(h.harvest_date);
        return isWithinInterval(hDate, { start: m.start, end: m.end });
      });

      const monthlyYield = monthlyHarvests.reduce((sum, h) => sum + h.quantity, 0);

      const scores = monthlyHarvests.map((h) => {
        if (h.quality_grade === 'A') return 95;
        if (h.quality_grade === 'B') return 80;
        return 65;
      });
      const avgHealth =
        scores.length > 0 ? Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length) : 0;

      return {
        month: m.name,
        health: avgHealth,
        yield: monthlyYield,
      };
    });
  }, [harvests]);

  // 5. Compute Land Area Distribution
  const distribution = React.useMemo(() => {
    const activeLands = lands.filter((l) => l.status === 'active');
    const totalArea = activeLands.reduce((sum, l) => sum + l.area_ha, 0);

    const cropAreaMap: Record<string, number> = {};
    activeLands.forEach((l) => {
      const crop = l.current_crop || 'Istirahat / Fallow';
      cropAreaMap[crop] = (cropAreaMap[crop] || 0) + l.area_ha;
    });

    const colors = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))',
    ];

    return Object.entries(cropAreaMap).map(([name, area], idx) => {
      const percent = totalArea > 0 ? Math.round((area / totalArea) * 100) : 0;
      return {
        name,
        value: percent,
        color: colors[idx % colors.length],
      };
    });
  }, [lands]);

  const isLoading = isLandsLoading || isHarvestsLoading;

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <FarmingReportHeader />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <FarmingReportStats summary={summary} />
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {isLoading ? (
              <Skeleton className="h-[380px] w-full rounded-xl" />
            ) : (
              <FarmingTrendsChart data={trends} />
            )}
          </div>
          <div>
            {isLoading ? (
              <Skeleton className="h-[380px] w-full rounded-xl" />
            ) : (
              <LandDistributionChart data={distribution} />
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Laporan Historis</h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <RecentFarmingReports data={harvests} />
          )}
        </div>
      </div>
    </div>
  );
}
