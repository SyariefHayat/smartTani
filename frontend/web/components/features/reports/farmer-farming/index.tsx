'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { landService } from '@/services/land';
import { harvestService, HarvestRecord } from '@/services/harvest';
import { subMonths, format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { id } from 'date-fns/locale';

import { FarmingReportHeader } from './FarmingReportHeader';
import { FarmingReportStats } from './FarmingReportStats';
import { FarmingTrendsChart } from './FarmingTrendsChart';
import { LandDistributionChart } from './LandDistributionChart';
import { RecentFarmingReports } from './RecentFarmingReports';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

// High-fidelity fallback simulated data if backend farming services are offline
const MOCK_LANDS = [
  { id: 'L-101', name: 'Lahan Utara', area_ha: 2.5, current_crop: 'Cabai Merah', status: 'active' },
  { id: 'L-102', name: 'Lahan Selatan', area_ha: 1.8, current_crop: 'Tomat', status: 'active' },
  {
    id: 'L-103',
    name: 'Lahan Barat',
    area_ha: 3.2,
    current_crop: 'Bawang Merah',
    status: 'active',
  },
  { id: 'L-104', name: 'Lahan Timur', area_ha: 1.5, current_crop: 'Jagung', status: 'active' },
  { id: 'L-105', name: 'Lahan Bukit', area_ha: 2.0, current_crop: null, status: 'inactive' },
];

const MOCK_HARVESTS = [
  {
    id: 'H-901',
    harvest_date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    crop_name: 'Cabai Merah',
    quantity: 450,
    unit: 'kg',
    quality_grade: 'A' as const,
    land_id: 'L-101',
    land: { name: 'Lahan Utara' },
  },
  {
    id: 'H-902',
    harvest_date: format(subMonths(new Date(), 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    crop_name: 'Tomat',
    quantity: 800,
    unit: 'kg',
    quality_grade: 'A' as const,
    land_id: 'L-102',
    land: { name: 'Lahan Selatan' },
  },
  {
    id: 'H-903',
    harvest_date: format(subMonths(new Date(), 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    crop_name: 'Bawang Merah',
    quantity: 1200,
    unit: 'kg',
    quality_grade: 'B' as const,
    land_id: 'L-103',
    land: { name: 'Lahan Barat' },
  },
  {
    id: 'H-904',
    harvest_date: format(subMonths(new Date(), 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    crop_name: 'Jagung',
    quantity: 1500,
    unit: 'kg',
    quality_grade: 'A' as const,
    land_id: 'L-104',
    land: { name: 'Lahan Timur' },
  },
  {
    id: 'H-905',
    harvest_date: format(subMonths(new Date(), 4), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    crop_name: 'Cabai Merah',
    quantity: 380,
    unit: 'kg',
    quality_grade: 'B' as const,
    land_id: 'L-101',
    land: { name: 'Lahan Utara' },
  },
  {
    id: 'H-906',
    harvest_date: format(subMonths(new Date(), 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
    crop_name: 'Tomat',
    quantity: 750,
    unit: 'kg',
    quality_grade: 'C' as const,
    land_id: 'L-102',
    land: { name: 'Lahan Selatan' },
  },
];

export function FarmingReportsManagement() {
  // 1. Fetch Lands
  const {
    data: landsData,
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
    data: harvestsData,
    isLoading: isHarvestsLoading,
    isError: isHarvestsError,
    refetch: refetchHarvests,
    isRefetching: isRefetchingHarvests,
  } = useQuery({
    queryKey: ['harvests'],
    queryFn: async () => harvestService.getHarvests(),
  });

  const isQueryError = isLandsError || isHarvestsError;

  // Automatically fall back to high-fidelity demo data on API error
  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan Laporan Pertanian offline. Menggunakan data demo lokal.', {
        description:
          'Layanan backend analytics tidak merespon. Menampilkan data simulasi pertanian agar Anda tetap dapat meninjau dashboard.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const activeLands = React.useMemo(() => {
    return isQueryError ? MOCK_LANDS : landsData || [];
  }, [isQueryError, landsData]);

  const activeHarvests = React.useMemo(() => {
    return (isQueryError ? MOCK_HARVESTS : harvestsData || []) as HarvestRecord[];
  }, [isQueryError, harvestsData]);

  // 3. Compute Stats Summary
  const summary = React.useMemo(() => {
    const filteredLands = activeLands.filter((l) => l.status === 'active');
    const totalLandArea = filteredLands.reduce((sum, l) => sum + Number(l.area_ha || 0), 0);

    const activeCropsSet = new Set(filteredLands.map((l) => l.current_crop).filter(Boolean));
    const activeCropCount = activeCropsSet.size;

    const qualityScores = activeHarvests.map((h) => {
      if (h.quality_grade === 'A') return 95;
      if (h.quality_grade === 'B') return 80;
      return 65;
    });
    const averageHealthScore =
      qualityScores.length > 0
        ? Math.round(qualityScores.reduce((sum, s) => sum + s, 0) / qualityScores.length)
        : 0;

    const totalHarvestVal = activeHarvests.reduce((sum, h) => sum + Number(h.quantity || 0), 0);

    return {
      totalLandArea,
      activeCropCount,
      averageHealthScore,
      projectedHarvestVal: totalHarvestVal,
    };
  }, [activeLands, activeHarvests]);

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
      const monthlyHarvests = activeHarvests.filter((h) => {
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
  }, [activeHarvests]);

  // 5. Compute Land Area Distribution
  const distribution = React.useMemo(() => {
    const filteredLands = activeLands.filter((l) => l.status === 'active');
    const totalArea = filteredLands.reduce((sum, l) => sum + Number(l.area_ha || 0), 0);

    const cropAreaMap: Record<string, number> = {};
    filteredLands.forEach((l) => {
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
  }, [activeLands]);

  const handleRetry = () => {
    refetchLands();
    refetchHarvests();
  };

  const isLoading = (isLandsLoading || isHarvestsLoading) && !isQueryError;
  const isRefetching = isRefetchingLands || isRefetchingHarvests;

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        {isQueryError && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
              <p>
                Mode Offline Simulasi: Koneksi ke server laporan pertanian terputus. Menampilkan
                data lokal demo agar Anda tetap dapat menjelajahi layout.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 cursor-pointer border-amber-300 text-amber-800 bg-white hover:bg-amber-100 font-bold shrink-0 text-[10px]"
              onClick={handleRetry}
              disabled={isRefetching}
            >
              <RefreshCw className={`mr-1 h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Hubungkan...' : 'Coba Hubungkan Kembali'}
            </Button>
          </div>
        )}

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
            <RecentFarmingReports data={activeHarvests} />
          )}
        </div>
      </div>
    </div>
  );
}
