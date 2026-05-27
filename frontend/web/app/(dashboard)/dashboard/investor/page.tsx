'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { investmentService, Proposal } from '@/services/investment';
import { analyticsService } from '@/services/analytics';
import { ProposalCard } from '@/components/features/investment/ProposalCard';
import { useAuthStore } from '@/stores/auth';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Wallet,
  TrendingUp,
  Landmark,
  Calendar,
  ArrowRight,
  Eye,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

const MOCK_ANALYTICS = {
  total_invested: 48000000,
  projected_return: 55870000,
  actual_return: 9280000,
  active_investments_count: 2,
};

const MOCK_ROI_CHART = [
  { month: 'Des', invested: 10000000, return: 0 },
  { month: 'Jan', invested: 0, return: 5000000 },
  { month: 'Feb', invested: 15000000, return: 0 },
  { month: 'Mar', invested: 8000000, return: 9280000 },
  { month: 'Apr', invested: 0, return: 0 },
  { month: 'Mei', invested: 15000000, return: 0 },
];

const MOCK_RECENT_INVESTMENTS = [
  {
    id: 'INV-001',
    amount: 15000000,
    invested_at: '2026-05-20T08:00:00Z',
    status: 'paid',
    proposal: {
      title: 'Budidaya Cabai Merah Keriting Hidroponik',
      commodity: 'Cabai Merah',
      projected_roi_percent: 15,
    },
  },
  {
    id: 'INV-002',
    amount: 8000000,
    invested_at: '2026-04-12T10:30:00Z',
    status: 'completed',
    proposal: {
      title: 'Pengembangan Perkebunan Tomat Organik',
      commodity: 'Tomat',
      projected_roi_percent: 14,
    },
  },
  {
    id: 'INV-003',
    amount: 25000000,
    invested_at: '2026-05-15T14:00:00Z',
    status: 'paid',
    proposal: {
      title: 'Peningkatan Hasil Panen Padi Mentik Wangi',
      commodity: 'Padi',
      projected_roi_percent: 18,
    },
  },
];

const MOCK_RECENT_PROPOSALS = [
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
    use_of_funds: 'Pembelian bibit unggul, pembangunan green house, instalasi irigasi otomatis.',
    risk_notes: 'Fluktuasi cuaca ekstrem dan risiko serangan hama kutu daun.',
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
    use_of_funds: 'Rak vertikultur, instalasi drip irrigation, mulsa plastik premium.',
    risk_notes: 'Curah hujan terlalu tinggi di masa pembungaan stroberi.',
    supporting_docs: [],
    status: 'approved' as const,
    created_at: '2026-05-26T08:00:00Z',
    updated_at: '2026-05-26T08:00:00Z',
  },
  {
    id: 'PROP-06',
    farmer_id: 'F-04',
    title: 'Ekspansi Lahan Bawang Merah Brebes Premium',
    commodity: 'Bawang Merah',
    land_area_ha: 1.2,
    location: {
      province: 'Jawa Tengah',
      city: 'Brebes',
      district: 'Wanasari',
      full_address: 'Desa Klampok',
    },
    funding_needed: 60000000,
    funding_raised: 42000000,
    projected_roi_percent: 17,
    duration_days: 75,
    harvest_date_estimated: '2026-08-15T00:00:00Z',
    description:
      'Bawang merah Brebes terkenal akan daya simpan tinggi dan aroma kuat. Proyek ekspansi lahan.',
    use_of_funds: 'Sewa tambahan lahan, pupuk NPK, pestisida organik, upah tenaga harian.',
    risk_notes: 'Harga pasar fluktuatif di musim panen raya nasional.',
    supporting_docs: [],
    status: 'approved' as const,
    created_at: '2026-05-27T09:00:00Z',
    updated_at: '2026-05-27T09:00:00Z',
  },
];

export default function InvestorOverviewPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Queries
  const {
    data: analyticsData,
    isError: isAnalyticsError,
    isLoading: isAnalyticsLoading,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ['investor-analytics-overview', user?.id],
    queryFn: () => analyticsService.getInvestorAnalytics(user?.id || ''),
    enabled: !!user?.id,
  });

  const {
    data: chartData,
    isError: isChartError,
    isLoading: isChartLoading,
    refetch: refetchChart,
  } = useQuery({
    queryKey: ['investor-roi-chart-overview', user?.id],
    queryFn: () => analyticsService.getInvestorROIChart(user?.id || ''),
    enabled: !!user?.id,
  });

  const {
    data: proposalsResponse,
    isError: isProposalsError,
    isLoading: isProposalsLoading,
    refetch: refetchProposals,
  } = useQuery({
    queryKey: ['investor-proposals-overview'],
    queryFn: () => investmentService.getProposals({ status: 'approved', limit: 3 }),
  });

  const isQueryError = isAnalyticsError || isChartError || isProposalsError;
  const isLoading = (isAnalyticsLoading || isChartLoading || isProposalsLoading) && !isQueryError;

  const handleRetry = () => {
    refetchAnalytics();
    refetchChart();
    refetchProposals();
  };

  const activeAnalytics = isQueryError ? MOCK_ANALYTICS : analyticsData || MOCK_ANALYTICS;
  const activeChart = isQueryError ? MOCK_ROI_CHART : chartData || MOCK_ROI_CHART;
  const activeProposals = isQueryError
    ? MOCK_RECENT_PROPOSALS
    : proposalsResponse?.data?.proposals || MOCK_RECENT_PROPOSALS;

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[350px]" />
          <Skeleton className="h-[350px]" />
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
              <p className="text-xs font-bold">Layanan Ringkasan Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data simulasi overview. Silakan hubungkan kembali server Anda untuk data
                terbaru.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="h-7 text-[10px] font-bold border-amber-300 text-amber-700 bg-white hover:bg-amber-100 hover:text-amber-800 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Greeting Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Selamat Pagi,{' '}
          {(user as unknown as Record<string, string>)?.name ||
            (user as unknown as Record<string, string>)?.full_name ||
            'Investor'}
          ! 👋
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Berikut adalah rangkuman pertumbuhan portofolio investasi Anda di SmartTani hari ini.
        </p>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Dana Ditanam
            </CardDescription>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800 tabular-nums">
              {formatCurrency(activeAnalytics.total_invested)}
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Modal investasi terakumulasi</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Proyeksi Hasil Panen
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-blue-600 tabular-nums">
              {formatCurrency(activeAnalytics.projected_return)}
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Estimasi total imbal hasil</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Keuntungan Cair
            </CardDescription>
            <Landmark className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-emerald-600 tabular-nums">
              {formatCurrency(activeAnalytics.actual_return)}
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Realisasi ROI masuk dompet</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Proyek Tani Aktif
            </CardDescription>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800 tabular-nums">
              {activeAnalytics.active_investments_count} Proyek
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Sedang dalam proses pertanian</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Bar Chart & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart (2/3) */}
        <Card className="lg:col-span-2 border border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-800">
              Tren Pertumbuhan Modal & ROI
            </CardTitle>
            <CardDescription className="text-xs">
              Time-series bulanan historical dana keluar vs imbal hasil cair.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `Rp ${v / 1000000}jt`}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value)), 'Jumlah']}
                    contentStyle={{
                      background: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '11px',
                    }}
                  />
                  <Bar
                    dataKey="invested"
                    name="Dana Ditanam"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="return"
                    name="Imbal Hasil Cair"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Table Ringkas (1/3) */}
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">Investasi Terbaru</CardTitle>
              <CardDescription className="text-[10px]">
                3 proyek yang terakhir didanai.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] font-bold text-slate-500 hover:text-green-600 flex items-center gap-1 cursor-pointer"
              onClick={() => router.push('/dashboard/investor/portfolio')}
            >
              Semua <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {MOCK_RECENT_INVESTMENTS.map((inv) => {
                  const isCompleted = inv.status === 'completed';
                  return (
                    <TableRow
                      key={inv.id}
                      className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <TableCell className="py-3.5 pl-5">
                        <span className="font-semibold text-slate-800 block text-xs line-clamp-1">
                          {inv.proposal.title}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                          {inv.proposal.commodity} • ROI +{inv.proposal.projected_roi_percent}%
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-right pr-5">
                        <span className="font-bold text-slate-800 block text-xs">
                          {formatCurrency(inv.amount)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[9px] font-bold ${
                            isCompleted ? 'text-green-600' : 'text-blue-600'
                          } mt-0.5`}
                        >
                          <span
                            className={`h-1 w-1 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                          />
                          {isCompleted ? 'Selesai' : 'Aktif'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Section: Proposal Terbuka (Cari Peluang Investasi) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Peluang Investasi Pertanian Terbuka
            </h2>
            <p className="text-[10px] text-slate-500 font-medium">
              Bantu pendanaan petani lokal dan dapatkan imbal hasil kompetitif berkelanjutan.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-bold border-slate-200 hover:border-green-300 text-slate-700 bg-white hover:text-green-700 cursor-pointer"
            onClick={() => router.push('/dashboard/investor/proposals')}
          >
            Lihat Semua Peluang
          </Button>
        </div>

        {/* Proposals Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {activeProposals.map((proposal) => (
            <div key={proposal.id} className="min-w-0">
              <ProposalCard proposal={proposal as unknown as Proposal} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
