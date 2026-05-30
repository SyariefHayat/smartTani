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
import { toast } from 'sonner';

import { DateRangeContext } from '@/context/dateRange';
import { DateRange } from 'react-day-picker';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';



export function FarmingReportsManagement() {
  // Date context states (default to last 6 months to showcase fully populated historical trends cleanly)
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });

  // 1. Fetch Lands
  const {
    data: landsData,
    isLoading: isLandsLoading,
    isError: isLandsError,
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
  } = useQuery({
    queryKey: ['harvests'],
    queryFn: async () => harvestService.getHarvests(),
  });

  // Filter states
  const [isFilterActive, setIsFilterActive] = React.useState(false);
  const [searchCropQuery, setSearchCropQuery] = React.useState('');
  const [selectedLandIdFilter, setSelectedLandIdFilter] = React.useState<string>('all');

  // Create Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [newHarvest, setNewHarvest] = React.useState({
    land_id: '',
    crop_name: '',
    quantity: '',
    unit: 'kg',
    harvest_date: format(new Date(), 'yyyy-MM-dd'),
    quality_grade: 'A' as 'A' | 'B' | 'C',
    notes: '',
  });

  const isOffline = isLandsError || isHarvestsError;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Gagal menghubungkan ke layanan laporan pertanian. Koneksi terputus.');
    }
  }, [isOffline]);

  const activeLands = React.useMemo(() => {
    if (isOffline) return [];
    return landsData || [];
  }, [isOffline, landsData]);

  const activeHarvests = React.useMemo(() => {
    if (isOffline) return [];
    return (harvestsData || []) as HarvestRecord[];
  }, [isOffline, harvestsData]);

  // Apply filters dynamically in memory
  const filteredHarvests = React.useMemo(() => {
    let result = activeHarvests;

    // Filter by Date Range Picker
    if (date?.from) {
      const fromTime = new Date(date.from).getTime();
      // Set toTime to end of to-date if defined, otherwise end of today
      const toTime = date.to ? new Date(date.to).getTime() : new Date().getTime();

      result = result.filter((h) => {
        const hTime = new Date(h.harvest_date).getTime();
        return hTime >= fromTime && hTime <= toTime;
      });
    }

    // Filter by selected land
    if (selectedLandIdFilter !== 'all') {
      result = result.filter((h) => h.land_id === selectedLandIdFilter);
    }

    // Filter by crop name
    if (searchCropQuery.trim() !== '') {
      result = result.filter((h) =>
        h.crop_name.toLowerCase().includes(searchCropQuery.toLowerCase())
      );
    }
    return result;
  }, [activeHarvests, selectedLandIdFilter, searchCropQuery, date]);

  // 3. Compute Stats Summary (based on filtered harvests)
  const summary = React.useMemo(() => {
    if (isOffline) {
      return {
        totalLandArea: 0,
        activeCropCount: 0,
        averageHealthScore: 0,
        projectedHarvestVal: 0,
      };
    }
    const filteredLands = activeLands.filter((l) => l.status === 'active');
    const totalLandArea = filteredLands.reduce((sum, l) => sum + Number(l.area_ha || 0), 0);

    const activeCropsSet = new Set(filteredLands.map((l) => l.current_crop).filter(Boolean));
    const activeCropCount = activeCropsSet.size;

    const qualityScores = filteredHarvests.map((h) => {
      if (h.quality_grade === 'A') return 95;
      if (h.quality_grade === 'B') return 80;
      return 65;
    });
    const averageHealthScore =
      qualityScores.length > 0
        ? Math.round(qualityScores.reduce((sum, s) => sum + s, 0) / qualityScores.length)
        : 0;

    const totalHarvestVal = filteredHarvests.reduce((sum, h) => sum + Number(h.quantity || 0), 0);

    return {
      totalLandArea,
      activeCropCount,
      averageHealthScore,
      projectedHarvestVal: totalHarvestVal,
    };
  }, [activeLands, filteredHarvests, isOffline]);

  // 4. Compute 6-Month Trends
  const trends = React.useMemo(() => {
    if (isOffline) return [];
    const last6Months = Array.from({ length: 6 }).map((_, idx) => {
      const d = subMonths(new Date(), 5 - idx);
      return {
        name: format(d, 'MMM', { locale: id }),
        start: startOfMonth(d),
        end: endOfMonth(d),
      };
    });

    return last6Months.map((m) => {
      const monthlyHarvests = filteredHarvests.filter((h) => {
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
  }, [filteredHarvests, isOffline]);

  // 5. Compute Land Area Distribution
  const distribution = React.useMemo(() => {
    if (isOffline) return [];
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
  }, [activeLands, isOffline]);



  const handleLandChange = (val: string) => {
    const land = activeLands.find((l) => l.id === val);
    setNewHarvest((prev) => ({
      ...prev,
      land_id: val,
      crop_name: land?.current_crop || '',
    }));
  };

  const handleCreateHarvest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHarvest.land_id || !newHarvest.crop_name || !newHarvest.quantity) {
      toast.error('Harap isi semua kolom wajib!');
      return;
    }

    setIsSubmitting(true);
    try {
      await harvestService.createHarvest({
        land_id: newHarvest.land_id,
        crop_name: newHarvest.crop_name,
        quantity: Number(newHarvest.quantity),
        unit: newHarvest.unit,
        harvest_date: new Date(newHarvest.harvest_date).toISOString(),
        quality_grade: newHarvest.quality_grade,
        notes: newHarvest.notes,
      });

      toast.success('Catatan panen berhasil dibuat');
      setIsCreateModalOpen(false);
      // Reset form
      setNewHarvest({
        land_id: '',
        crop_name: '',
        quantity: '',
        unit: 'kg',
        harvest_date: format(new Date(), 'yyyy-MM-dd'),
        quality_grade: 'A',
        notes: '',
      });
      // Trigger refresh
      refetchHarvests();
    } catch (err: unknown) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan';
      const responseMessage = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message;
      toast.error('Gagal menyimpan laporan baru.', {
        description: responseMessage || errorMessage || 'Layanan backend offline.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = (isLandsLoading || isHarvestsLoading) && !isOffline;

  return (
    <DateRangeContext.Provider value={{ date, setDate }}>
      <div className="w-full text-slate-900 animate-in fade-in duration-500">
        <div className="mx-auto flex w-full flex-col gap-6">
          <FarmingReportHeader
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            onToggleFilter={() => setIsFilterActive(!isFilterActive)}
            isFilterActive={isFilterActive}
          />

          {isOffline ? (
            <>
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                Gagal memuat data statistik laporan pertanian / Koneksi ke server terputus
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                    Gagal memuat tren kualitas & kuantitas panen / Koneksi ke server terputus
                  </div>
                </div>
                <div>
                  <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                    Gagal memuat persentase distribusi lahan tani / Koneksi ke server terputus
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Laporan Historis</h2>
                </div>
                <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                  Gagal memuat daftar riwayat catatan panen / Koneksi ke server terputus
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Real-time filtering section */}
              {isFilterActive && (
                <div className="flex flex-col gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 shadow-2xs md:flex-row md:items-center animate-fade-in">
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor="search-crop"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-wide"
                    >
                      Cari Komoditas
                    </Label>
                    <Input
                      id="search-crop"
                      placeholder="Cari nama komoditas tanaman (contoh: Cabai)..."
                      value={searchCropQuery}
                      onChange={(e) => setSearchCropQuery(e.target.value)}
                      className="text-xs h-9 bg-white border-slate-200 shadow-3xs"
                    />
                  </div>
                  <div className="w-full md:w-56 space-y-1">
                    <Label
                      htmlFor="filter-land"
                      className="text-[11px] font-bold text-slate-500 uppercase tracking-wide"
                    >
                      Filter Sesuai Lahan
                    </Label>
                    <Select value={selectedLandIdFilter} onValueChange={setSelectedLandIdFilter}>
                      <SelectTrigger
                        id="filter-land"
                        className="text-xs h-9 bg-white border-slate-200 shadow-3xs"
                      >
                        <SelectValue placeholder="Semua Lahan" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-slate-250 shadow-md">
                        <SelectItem value="all">Semua Lahan</SelectItem>
                        {activeLands.map((land) => (
                          <SelectItem key={land.id} value={land.id}>
                            {land.name} ({land.area_ha} Ha)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(searchCropQuery || selectedLandIdFilter !== 'all') && (
                    <div className="self-end md:self-auto pt-4 md:pt-4">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setSearchCropQuery('');
                          setSelectedLandIdFilter('all');
                        }}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer h-9 px-3"
                      >
                        Reset Filter
                      </Button>
                    </div>
                  )}
                </div>
              )}

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
                  <h2 className="text-lg font-bold text-slate-800">Laporan Historis</h2>
                </div>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : (
                  <RecentFarmingReports data={filteredHarvests} />
                )}
              </div>
            </>
          )}
        </div>

        {/* Create Modal Dialog */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white text-slate-900">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-850">
                Catat Hasil Panen Baru
              </DialogTitle>
              <DialogDescription className="mt-1 text-slate-500 text-xs leading-normal">
                Masukkan data hasil panen dari lahan tani Anda untuk pendataan dan pelaporan yang
                rapi.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreateHarvest} className="space-y-4 py-4 text-slate-900">
              {/* Land Selector */}
              <div className="space-y-2">
                <Label htmlFor="land_id">Pilih Lahan Tani</Label>
                <Select value={newHarvest.land_id} onValueChange={handleLandChange} required>
                  <SelectTrigger id="land_id">
                    <SelectValue placeholder="Pilih lokasi lahan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-slate-200">
                    {activeLands.map((land) => (
                      <SelectItem key={land.id} value={land.id}>
                        {land.name} ({(land as { location_city?: string }).location_city})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Crop name & Quality Grade */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="crop_name">Nama Komoditas / Tanaman</Label>
                  <Input
                    id="crop_name"
                    value={newHarvest.crop_name}
                    onChange={(e) => setNewHarvest({ ...newHarvest, crop_name: e.target.value })}
                    placeholder="Contoh: Padi Ciherang"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quality_grade">Kualitas Panen</Label>
                  <Select
                    value={newHarvest.quality_grade}
                    onValueChange={(val: 'A' | 'B' | 'C') =>
                      setNewHarvest({ ...newHarvest, quality_grade: val })
                    }
                  >
                    <SelectTrigger id="quality_grade">
                      <SelectValue placeholder="Pilih Grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-slate-200">
                      <SelectItem value="A">Grade A (Sangat Baik)</SelectItem>
                      <SelectItem value="B">Grade B (Baik)</SelectItem>
                      <SelectItem value="C">Grade C (Cukup)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Yield & Unit */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="quantity">Jumlah Hasil Panen</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="any"
                    min="0"
                    value={newHarvest.quantity}
                    onChange={(e) => setNewHarvest({ ...newHarvest, quantity: e.target.value })}
                    placeholder="Masukkan kuantitas"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Satuan</Label>
                  <Input
                    id="unit"
                    value={newHarvest.unit}
                    onChange={(e) => setNewHarvest({ ...newHarvest, unit: e.target.value })}
                    placeholder="kg, ton, ikat"
                    required
                  />
                </div>
              </div>

              {/* Harvest Date */}
              <div className="space-y-2">
                <Label htmlFor="harvest_date">Tanggal Panen</Label>
                <Input
                  id="harvest_date"
                  type="date"
                  value={newHarvest.harvest_date}
                  onChange={(e) => setNewHarvest({ ...newHarvest, harvest_date: e.target.value })}
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Catatan Tambahan (Opsional)</Label>
                <Textarea
                  id="notes"
                  value={newHarvest.notes}
                  onChange={(e) => setNewHarvest({ ...newHarvest, notes: e.target.value })}
                  placeholder="Keterangan kondisi panen, cuaca, dll..."
                  className="resize-none min-h-[80px]"
                />
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="cursor-pointer font-semibold text-slate-700 text-xs h-9"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Catat Hasil Panen'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DateRangeContext.Provider>
  );
}
