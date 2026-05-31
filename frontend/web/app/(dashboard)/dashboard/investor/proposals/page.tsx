'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentService, Proposal } from '@/services/investment';
import { ProposalCard } from '@/components/features/investment/ProposalCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Sprout, ArrowUpDown, X } from 'lucide-react';

const MOCK_PROPOSALS = [
  {
    id: 'PROP-01',
    farmer_id: 'F-01',
    title: 'Budidaya Cabai Merah Keriting Hidroponik',
    commodity: 'Cabai Merah',
    land_area_ha: 0.8,
    location: {
      province: 'Jawa Barat',
      city: 'Cianjur',
      district: 'Pacet',
      full_address: 'Desa Cipendawa',
    },
    funding_needed: 30000000,
    funding_raised: 15000000,
    projected_roi_percent: 15,
    duration_days: 120,
    harvest_date_estimated: '2026-09-15T00:00:00Z',
    description:
      'Budidaya cabai merah keriting berkualitas prima menggunakan nutrisi hidroponik modern.',
    use_of_funds: 'Sewa greenhouse, nutrisi AB Mix, rockwool, instalasi drip.',
    risk_notes: 'Kenaikan suhu greenhouse ekstrem di musim kemarau.',
    supporting_docs: [],
    status: 'approved' as const,
    created_at: '2026-05-20T08:00:00Z',
    updated_at: '2026-05-20T08:00:00Z',
  },
  {
    id: 'PROP-02',
    farmer_id: 'F-01',
    title: 'Pengembangan Perkebunan Tomat Unggul Organik',
    commodity: 'Tomat',
    land_area_ha: 0.5,
    location: {
      province: 'Jawa Timur',
      city: 'Malang',
      district: 'Batu',
      full_address: 'Desa Tulungrejo',
    },
    funding_needed: 15000000,
    funding_raised: 8000000,
    projected_roi_percent: 14,
    duration_days: 90,
    harvest_date_estimated: '2026-07-20T00:00:00Z',
    description: 'Pengembangan perkebunan tomat Beef organik untuk mensuplai supermarket nasional.',
    use_of_funds: 'Beli bibit Tomat F1, pupuk organik hayati, jaring mulsa.',
    risk_notes: 'Tingginya curah hujan di awal masa penanaman.',
    supporting_docs: [],
    status: 'approved' as const,
    created_at: '2026-05-21T10:00:00Z',
    updated_at: '2026-05-21T10:00:00Z',
  },
  {
    id: 'PROP-03',
    farmer_id: 'F-03',
    title: 'Peningkatan Hasil Panen Padi Mentik Wangi',
    commodity: 'Padi',
    land_area_ha: 1.5,
    location: {
      province: 'Jawa Tengah',
      city: 'Klaten',
      district: 'Delanggu',
      full_address: 'Desa Sidowayah',
    },
    funding_needed: 40000000,
    funding_raised: 25000000,
    projected_roi_percent: 18,
    duration_days: 150,
    harvest_date_estimated: '2026-10-15T00:00:00Z',
    description:
      'Penerapan teknologi pertanian presisi pada budidaya padi organik harum aroma pandan.',
    use_of_funds: 'Pembelian pupuk organik cair, bibit padi super, mekanisasi panen.',
    risk_notes: 'Risiko serangan hama burung emprit di masa pengisian bulir padi.',
    supporting_docs: [],
    status: 'approved' as const,
    created_at: '2026-05-22T14:00:00Z',
    updated_at: '2026-05-22T14:00:00Z',
  },
  {
    id: 'PROP-04',
    farmer_id: 'F-02',
    title: 'Budidaya Melon Alisha Berkualitas Tinggi',
    commodity: 'Melon',
    land_area_ha: 0.5,
    location: {
      province: 'Jawa Tengah',
      city: 'Boyolali',
      district: 'Ampel',
      full_address: 'Desa Sidomulyo',
    },
    funding_needed: 35000000,
    funding_raised: 12000000,
    projected_roi_percent: 16,
    duration_days: 100,
    harvest_date_estimated: '2026-09-10T00:00:00Z',
    description: 'Proyek penanaman melon kualitas premium dengan teknik green house.',
    use_of_funds: 'Pembelian bibit melon premium, nutrisi greenhouse.',
    risk_notes: 'Fluktuasi harga pupuk dan curah hujan tidak stabil.',
    supporting_docs: [],
    status: 'approved' as const,
    created_at: '2026-05-25T10:00:00Z',
    updated_at: '2026-05-25T10:00:00Z',
  },
  {
    id: 'PROP-05',
    farmer_id: 'F-03',
    title: 'Modernisasi Kebun Stroberi Dataran Tinggi',
    commodity: 'Stroberi',
    land_area_ha: 0.3,
    location: {
      province: 'Jawa Barat',
      city: 'Bandung',
      district: 'Lembang',
      full_address: 'Kp. Cikole',
    },
    funding_needed: 20000000,
    funding_raised: 18000000,
    projected_roi_percent: 15,
    duration_days: 80,
    harvest_date_estimated: '2026-08-20T00:00:00Z',
    description:
      'Modernisasi sistem pertanian stroberi dengan metode vertikultur untuk melipatgandakan hasil.',
    use_of_funds: 'Rak besi vertikultur, mulsa premium.',
    risk_notes: 'Kelembaban berlebih memicu penyakit jamur stroberi.',
    supporting_docs: [],
    status: 'approved' as const,
    created_at: '2026-05-26T08:00:00Z',
    updated_at: '2026-05-26T08:00:00Z',
  },
];

const commodityOptions = [
  { value: 'all', label: 'Semua Komoditas' },
  { value: 'Cabai Merah', label: 'Cabai Merah' },
  { value: 'Tomat', label: 'Tomat' },
  { value: 'Padi', label: 'Padi' },
  { value: 'Melon', label: 'Melon' },
  { value: 'Stroberi', label: 'Stroberi' },
];

const provinceOptions = [
  { value: 'all', label: 'Semua Lokasi' },
  { value: 'Jawa Barat', label: 'Jawa Barat' },
  { value: 'Jawa Tengah', label: 'Jawa Tengah' },
  { value: 'Jawa Timur', label: 'Jawa Timur' },
];

export default function InvestorProposalsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCommodity, setSelectedCommodity] = React.useState('all');
  const [selectedLocation, setSelectedLocation] = React.useState('all');
  const [sortBy, setSortBy] = React.useState<'newest' | 'roi' | 'progress'>('newest');

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCommodity !== 'all' ||
    selectedLocation !== 'all' ||
    sortBy !== 'newest';

  const resetFilters = React.useCallback(() => {
    setSearchQuery('');
    setSelectedCommodity('all');
    setSelectedLocation('all');
    setSortBy('newest');
    toast.success('Filter pencarian berhasil direset');
  }, []);

  const {
    data: proposalsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['investor-proposals-browse'],
    queryFn: () => investmentService.getProposals({ status: 'approved', limit: 30 }),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Koneksi ke server proposal terputus. Gagal memuat data teraktual.');
    }
  }, [isQueryError]);

  const rawProposals = (
    isQueryError ? MOCK_PROPOSALS : proposalsResponse?.data?.proposals || MOCK_PROPOSALS
  ) as Proposal[];

  // Filter & sort
  const processedProposals = React.useMemo(() => {
    let result = [...rawProposals];

    // Search query
    if (searchQuery.trim() !== '') {
      result = result.filter(
        (prop) =>
          prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.commodity.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Commodity filter
    if (selectedCommodity !== 'all') {
      result = result.filter((prop) => prop.commodity === selectedCommodity);
    }

    // Location filter
    if (selectedLocation !== 'all') {
      result = result.filter((prop) => prop.location.province === selectedLocation);
    }

    // Sort options
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'roi') {
      result.sort((a, b) => b.projected_roi_percent - a.projected_roi_percent);
    } else if (sortBy === 'progress') {
      result.sort((a, b) => {
        const progressA = Number(a.funding_raised) / Number(a.funding_needed);
        const progressB = Number(b.funding_raised) / Number(b.funding_needed);
        return progressB - progressA;
      });
    }

    return result;
  }, [rawProposals, searchQuery, selectedCommodity, selectedLocation, sortBy]);

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header & Status Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
            Peluang Investasi Terbuka
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Gunakan kecanggihan SmartTani untuk mendanai petani andal Lamongan dan raih ROI
            memuaskan.
          </p>
        </div>
        <div className="text-right text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full shrink-0 tracking-wide uppercase">
          {processedProposals.length} Proyek Terbuka
        </div>
      </div>

      {/* Filter Toolbar wrapped in standard flat Card */}
      <Card className="w-full border-slate-100/80 shadow-xs bg-white/70 backdrop-blur-md">
        <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex flex-col md:flex-row gap-3 sm:items-center">
            {/* Search bar input h-10 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari nama proposal atau komoditas..."
                className="pl-10 !h-10 border-slate-200 text-xs font-semibold text-slate-700 bg-white focus-visible:ring-emerald-500/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Select Commodity !h-10 */}
            <div className="w-full md:w-[200px]">
              <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                <SelectTrigger className="!h-10 border-slate-200 text-xs font-semibold text-slate-700 focus:border-green-500 cursor-pointer bg-white">
                  <SelectValue placeholder="Komoditas" />
                </SelectTrigger>
                <SelectContent>
                  {commodityOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs cursor-pointer font-medium text-slate-700 focus:bg-slate-50"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Location !h-10 */}
            <div className="w-full md:w-[200px]">
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="!h-10 border-slate-200 text-xs font-semibold text-slate-700 focus:border-green-500 cursor-pointer bg-white">
                  <SelectValue placeholder="Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  {provinceOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-xs cursor-pointer font-medium text-slate-700 focus:bg-slate-50"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select Sort !h-10 */}
            <div className="w-full md:w-[200px]">
              <Select
                value={sortBy}
                onValueChange={(val: 'newest' | 'roi' | 'progress') => setSortBy(val)}
              >
                <SelectTrigger className="!h-10 border-slate-200 text-xs font-semibold text-slate-700 focus:border-green-500 cursor-pointer bg-white">
                  <span className="flex items-center gap-1.5">
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" /> Urutkan
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="newest"
                    className="text-xs cursor-pointer font-medium text-slate-700 focus:bg-slate-50"
                  >
                    Terbaru
                  </SelectItem>
                  <SelectItem
                    value="roi"
                    className="text-xs cursor-pointer font-medium text-slate-700 focus:bg-slate-50"
                  >
                    ROI Tertinggi
                  </SelectItem>
                  <SelectItem
                    value="progress"
                    className="text-xs cursor-pointer font-medium text-slate-700 focus:bg-slate-50"
                  >
                    Hampir Terpenuhi
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters row */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100/80">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Filter Aktif:
                </span>
                {searchQuery && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-50 hover:bg-slate-100/80 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1 shrink-0 uppercase tracking-wider"
                  >
                    Cari: &quot;{searchQuery}&quot;
                    <X
                      onClick={() => setSearchQuery('')}
                      className="h-2.5 w-2.5 hover:text-red-500 cursor-pointer shrink-0"
                    />
                  </Badge>
                )}
                {selectedCommodity !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-50 hover:bg-slate-100/80 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1 shrink-0 uppercase tracking-wider"
                  >
                    Komoditas: {selectedCommodity}
                    <X
                      onClick={() => setSelectedCommodity('all')}
                      className="h-2.5 w-2.5 hover:text-red-500 cursor-pointer shrink-0"
                    />
                  </Badge>
                )}
                {selectedLocation !== 'all' && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-50 hover:bg-slate-100/80 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1 shrink-0 uppercase tracking-wider"
                  >
                    Lokasi: {selectedLocation}
                    <X
                      onClick={() => setSelectedLocation('all')}
                      className="h-2.5 w-2.5 hover:text-red-500 cursor-pointer shrink-0"
                    />
                  </Badge>
                )}
                {sortBy !== 'newest' && (
                  <Badge
                    variant="secondary"
                    className="bg-slate-50 hover:bg-slate-100/80 text-slate-600 font-bold text-[9px] px-2 py-0.5 rounded border border-slate-100 flex items-center gap-1 shrink-0 uppercase tracking-wider"
                  >
                    Urutan: {sortBy === 'roi' ? 'ROI Tertinggi' : 'Hampir Terpenuhi'}
                    <X
                      onClick={() => setSortBy('newest')}
                      className="h-2.5 w-2.5 hover:text-red-500 cursor-pointer shrink-0"
                    />
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-[9px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50/50 p-0 h-6 cursor-pointer ml-auto uppercase tracking-wider"
              >
                Reset Semua Filter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid listing */}
      {isQueryError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat peluang investasi pertanian / Koneksi ke server terputus
        </div>
      ) : processedProposals.length === 0 ? (
        <div className="py-24 text-center bg-white border border-slate-200 rounded-xl">
          <Sprout className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60 animate-bounce" />
          <p className="text-xs font-bold text-slate-700">Tidak Ada Proyek Tani Cocok</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Coba sesuaikan kata kunci pencarian atau filter komoditas Anda.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {processedProposals.map((prop) => (
            <div key={prop.id} className="min-w-0">
              <ProposalCard proposal={prop} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
