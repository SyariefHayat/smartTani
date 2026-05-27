'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { landService } from '@/services/land';
import { harvestService } from '@/services/harvest';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';

import { FarmingReportHeader } from './FarmingReportHeader';
import { FarmingReportStats } from './FarmingReportStats';
import { FarmingTrendsChart } from './FarmingTrendsChart';
import { LandDistributionChart } from './LandDistributionChart';
import { RecentFarmingReports } from './RecentFarmingReports';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export function FarmingReportsManagement() {
  // 1. Fetch Lands
  const {
    data: lands = [],
    isLoading: isLandsLoading,
    isError: isLandsError,
    refetch: refetchLands,
    isRefetching: isRefetchingLands,
  } = useQuery({
    queryKey: ['lands'],
    queryFn: async () => landService.getLands(),
  });

  // 2. Fetch Harvests
  const {
    data: harvests = [],
    isLoading: isHarvestsLoading,
    isError: isHarvestsError,
    refetch: refetchHarvests,
    isRefetching: isRefetchingHarvests,
  } = useQuery({
    queryKey: ['harvests'],
    queryFn: async () => harvestService.getHarvests(),
  });

  // 3. Compute Stats Summary — MUST be before any early returns
  const summary = React.useMemo(() => {
    const activeLands = lands.filter((l) => l.status === 'active');
    const totalLandArea = activeLands.reduce((sum, l) => sum + Number(l.area_ha || 0), 0);

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

    const totalHarvestVal = harvests.reduce((sum, h) => sum + Number(h.quantity || 0), 0);

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

      const monthlyYield = monthlyHarvests.reduce((sum, h) => sum + Number(h.quantity || 0), 0);

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
    const totalArea = activeLands.reduce((sum, l) => sum + Number(l.area_ha || 0), 0);

    const cropAreaMap: Record<string, number> = {};
    activeLands.forEach((l) => {
      const crop = l.current_crop || 'Istirahat / Fallow';
      cropAreaMap[crop] = (cropAreaMap[crop] || 0) + Number(l.area_ha || 0);
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

  // Error state — rendered after all hooks
  if (isLandsError || isHarvestsError) {
    const handleRetry = () => {
      refetchLands();
      refetchHarvests();
    };
    const isRefetching = isRefetchingLands || isRefetchingHarvests;

    return (
      <div className="flex w-full h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 text-red-500 p-6 text-center text-sm font-medium shadow-xs">
        <svg
          className="w-10 h-10 mb-3 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="font-semibold text-base mb-1">Gagal Memuat Laporan Tani</p>
        <p className="text-xs text-red-400 max-w-md mb-4">
          Layanan/Service tidak merespon atau sedang tidak aktif. Harap periksa koneksi Anda atau
          hubungi administrator.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600"
          onClick={handleRetry}
          disabled={isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {isRefetching ? 'Mencoba ulang...' : 'Coba Lagi'}
        </Button>
      </div>
    );
  }

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
