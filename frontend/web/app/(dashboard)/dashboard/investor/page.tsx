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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  AlertTriangle,
  Download,
} from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';

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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string | number;
    name: string;
    [key: string]: unknown;
  }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white/95 p-3 shadow-lg backdrop-blur-md min-w-56 text-slate-800">
        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b pb-1.5 border-slate-100">
          Bulan {label}
        </p>
        <div className="space-y-2 mt-2.5">
          {payload.map((item, index) => {
            const isInvested = item.dataKey === 'invested';
            const bulletColor = isInvested ? 'bg-emerald-500' : 'bg-blue-500';
            return (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${bulletColor}`} />
                  <span className="text-xs text-slate-500 font-medium">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {formatCurrency(Number(item.value))}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default function InvestorOverviewPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  // Role Guard
  React.useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard/investor');
      return;
    }

    if (user.role !== 'investor') {
      const dashboardSegment = user.role ? user.role.replace('_', '-') : '';
      router.push(dashboardSegment ? `/dashboard/${dashboardSegment}` : '/dashboard');
      return;
    }
  }, [router, user]);

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

  const {
    data: portfolioResponse,
    isError: isPortfolioError,
    isLoading: isPortfolioLoading,
    refetch: refetchPortfolio,
  } = useQuery({
    queryKey: ['investor-portfolio-overview', user?.id],
    queryFn: () => investmentService.getPortfolio(),
    enabled: !!user?.id,
  });

  const isQueryError = isAnalyticsError || isChartError || isProposalsError || isPortfolioError;
  const isLoading = (isAnalyticsLoading || isChartLoading || isProposalsLoading || isPortfolioLoading) && !isQueryError;

  // Safe Fallback Sonner Toast
  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan sedang offline. Menggunakan data demo lokal.');
    }
  }, [isQueryError]);

  const handleRetry = () => {
    refetchAnalytics();
    refetchChart();
    refetchProposals();
    refetchPortfolio();
  };

  const activeAnalytics = isQueryError ? MOCK_ANALYTICS : analyticsData || MOCK_ANALYTICS;
  const activeChart = isQueryError ? MOCK_ROI_CHART : chartData || MOCK_ROI_CHART;
  const activeProposals = isQueryError
    ? MOCK_RECENT_PROPOSALS
    : proposalsResponse?.data?.proposals || MOCK_RECENT_PROPOSALS;
  const activeRecentInvestments = isQueryError
    ? MOCK_RECENT_INVESTMENTS
    : portfolioResponse?.data?.slice(0, 3) || MOCK_RECENT_INVESTMENTS;

  const handleDownload = React.useCallback(() => {
    try {
      const summaryData = [
        { metrik: 'Total Dana Ditanam', nilai: formatCurrency(activeAnalytics.total_invested) },
        { metrik: 'Proyeksi Hasil Panen', nilai: formatCurrency(activeAnalytics.projected_return) },
        { metrik: 'Keuntungan Cair', nilai: formatCurrency(activeAnalytics.actual_return) },
        { metrik: 'Proyek Tani Aktif', nilai: `${activeAnalytics.active_investments_count} Proyek` },
      ];

      exportToCSV({
        data: summaryData,
        columns: [
          { header: 'Metrik', accessor: (row) => row.metrik },
          { header: 'Nilai', accessor: (row) => row.nilai },
        ],
        filename: 'laporan_ringkasan_investor',
      });

      toast.success('Laporan ringkasan investasi berhasil diunduh');
    } catch {
      toast.error('Gagal mengunduh laporan');
    }
  }, [activeAnalytics]);

  if (!user || user.role !== 'investor') return null;

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="min-w-0">
              <CardHeader className="gap-1 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm mt-1.5 pt-0">
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Dana Ditanam',
      value: formatCurrency(activeAnalytics.total_invested),
      footer: 'Modal investasi terakumulasi',
      icon: Wallet,
      iconColorClass: 'text-emerald-500',
      valueColorClass: 'text-slate-900',
    },
    {
      title: 'Proyeksi Hasil Panen',
      value: formatCurrency(activeAnalytics.projected_return),
      footer: 'Estimasi total imbal hasil',
      icon: TrendingUp,
      iconColorClass: 'text-blue-500',
      valueColorClass: 'text-slate-900',
    },
    {
      title: 'Keuntungan Cair',
      value: formatCurrency(activeAnalytics.actual_return),
      footer: 'Realisasi ROI masuk dompet',
      icon: Landmark,
      iconColorClass: 'text-emerald-500',
      valueColorClass: 'text-slate-900',
    },
    {
      title: 'Proyek Tani Aktif',
      value: `${activeAnalytics.active_investments_count} Proyek`,
      footer: 'Dalam proses budidaya',
      icon: Calendar,
      iconColorClass: 'text-amber-500',
      valueColorClass: 'text-slate-900',
    },
  ] as const;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Visual Red Alert Box when Offline */}
      {isQueryError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
            <p>
              Layanan Investor Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
            onClick={handleRetry}
          >
            Coba Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Header & Download Button */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
            Selamat Pagi,{' '}
            {(user as unknown as Record<string, string>)?.name ||
              (user as unknown as Record<string, string>)?.full_name ||
              'Investor'}
            ! 👋
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Rangkuman pertumbuhan portofolio investasi Anda di SmartTani hari ini.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Button
            variant="outline"
            className="w-full sm:w-auto cursor-pointer text-slate-700 bg-white"
            onClick={handleDownload}
          >
            <Download className="mr-2 h-4 w-4 text-slate-500" /> Download Laporan
          </Button>
        </div>
      </div>

      {/* Grid Statistik (Sesuai Gaya Farmer SectionCard) */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </CardDescription>
                <CardTitle
                  className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                  title={card.value}
                >
                  {card.value}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1 font-medium text-slate-500">
                  <Icon className={`size-4 shrink-0 ${card.iconColorClass}`} />
                  <span className="truncate">{card.footer}</span>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Main Content Area: ROI Chart & Recent Investments Table */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart (2/3) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100/80">
            <CardTitle className="text-base font-semibold text-slate-900">
              Tren Pertumbuhan Modal & ROI
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Histori kontribusi dana ditanam vs realisasi imbal hasil cair.
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
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="invested"
                    name="Dana Ditanam"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="return"
                    name="Imbal Hasil Cair"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Investments (1/3) */}
        <Card className="flex flex-col h-full">
          <CardHeader className="pb-3 border-b border-slate-100/80 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">Investasi Terbaru</CardTitle>
              <CardDescription className="text-[10px] text-slate-500">
                3 proyek terakhir yang didanai.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-[10px] font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
              onClick={() => router.push('/dashboard/investor/portfolio')}
            >
              Semua <ArrowRight className="h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-5 py-3 text-xs font-semibold text-slate-500">Proyek Pertanian</TableHead>
                  <TableHead className="pr-5 py-3 text-right text-xs font-semibold text-slate-500">Investasi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeRecentInvestments.map((inv) => {
                  const isCompleted = inv.status === 'completed';
                  return (
                    <TableRow
                      key={inv.id}
                      className="hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0"
                    >
                      <TableCell className="py-3.5 pl-5">
                        <span className="font-semibold text-slate-800 block text-xs line-clamp-1">
                          {inv.proposal?.title || 'Budidaya Tanaman'}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">
                          {inv.proposal?.commodity || 'Pertanian'} • ROI +{inv.proposal?.projected_roi_percent || 0}%
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-right pr-5">
                        <span className="font-bold text-slate-800 block text-xs">
                          {formatCurrency(inv.amount)}
                        </span>
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Selesai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700 mt-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            Aktif
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Peluang Investasi Pertanian Terbuka */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Peluang Investasi Pertanian Terbuka
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Bantu pendanaan petani lokal dan dapatkan imbal hasil kompetitif berkelanjutan.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer text-slate-700 bg-white text-xs h-9"
            onClick={() => router.push('/dashboard/investor/proposals')}
          >
            Lihat Semua Peluang
          </Button>
        </div>

        {/* Proposals Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {activeProposals.slice(0, 3).map((proposal) => (
            <div key={proposal.id} className="min-w-0">
              <ProposalCard proposal={proposal as unknown as Proposal} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
