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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Sprout, RefreshCw, AlertTriangle, ArrowUpDown } from 'lucide-react';

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

  const {
    data: proposalsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['investor-proposals-browse'],
    queryFn: () => investmentService.getProposals({ status: 'approved', limit: 30 }),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan proposal offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan data investasi simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
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
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Layanan Cari Peluang Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data investasi simulasi. Beberapa perubahan data hanya akan disimpan
                sementara.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-[10px] font-bold border-amber-300 text-amber-700 bg-white hover:bg-amber-100 hover:text-amber-800 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Coba Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Peluang Investasi Terbuka
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Gunakan kecanggihan SmartTani untuk mendanai petani andal Lamongan dan raih ROI memuaskan.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari nama proposal atau komoditas..."
            className="pl-10 h-10 border-slate-200 text-xs font-medium focus:border-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-[200px]">
          <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
            <SelectTrigger className="h-10 border-slate-200 text-xs font-medium focus:border-green-500 cursor-pointer">
              <SelectValue placeholder="Komoditas" />
            </SelectTrigger>
            <SelectContent>
              {commodityOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[200px]">
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="h-10 border-slate-200 text-xs font-medium focus:border-green-500 cursor-pointer">
              <SelectValue placeholder="Lokasi" />
            </SelectTrigger>
            <SelectContent>
              {provinceOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="text-xs cursor-pointer"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full md:w-[200px]">
          <Select
            value={sortBy}
            onValueChange={(val: 'newest' | 'roi' | 'progress') => setSortBy(val)}
          >
            <SelectTrigger className="h-10 border-slate-200 text-xs font-medium focus:border-green-500 cursor-pointer">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" /> Urutkan
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest" className="text-xs cursor-pointer">
                Terbaru
              </SelectItem>
              <SelectItem value="roi" className="text-xs cursor-pointer">
                ROI Tertinggi
              </SelectItem>
              <SelectItem value="progress" className="text-xs cursor-pointer">
                Hampir Terpenuhi
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid listing */}
      {processedProposals.length === 0 ? (
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
