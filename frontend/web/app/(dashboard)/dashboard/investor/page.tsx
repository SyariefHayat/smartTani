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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { Wallet, TrendingUp, Landmark, Calendar, ArrowRight, Download } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';

const chartConfig = {
  invested: {
    label: 'Dana Ditanam',
    color: '#10b981',
  },
  return: {
    label: 'Imbal Hasil Cair',
    color: '#3b82f6',
  },
} satisfies ChartConfig;

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
  const [activeMetric, setActiveMetric] = React.useState<'all' | 'invested' | 'return'>('all');

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
  } = useQuery({
    queryKey: ['investor-analytics-overview', user?.id],
    queryFn: () => analyticsService.getInvestorAnalytics(user?.id || ''),
    enabled: !!user?.id,
  });

  const {
    data: chartData,
    isError: isChartError,
    isLoading: isChartLoading,
  } = useQuery({
    queryKey: ['investor-roi-chart-overview', user?.id],
    queryFn: () => analyticsService.getInvestorROIChart(user?.id || ''),
    enabled: !!user?.id,
  });

  const {
    data: proposalsResponse,
    isError: isProposalsError,
    isLoading: isProposalsLoading,
  } = useQuery({
    queryKey: ['investor-proposals-overview'],
    queryFn: () => investmentService.getProposals({ status: 'approved', limit: 3 }),
  });

  const {
    data: portfolioResponse,
    isError: isPortfolioError,
    isLoading: isPortfolioLoading,
  } = useQuery({
    queryKey: ['investor-portfolio-overview', user?.id],
    queryFn: () => investmentService.getPortfolio(),
    enabled: !!user?.id,
  });

  const isQueryError = isAnalyticsError || isChartError || isProposalsError || isPortfolioError;
  const isLoading =
    (isAnalyticsLoading || isChartLoading || isProposalsLoading || isPortfolioLoading) &&
    !isQueryError;

  // Safe Fallback Sonner Toast
  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
    }
  }, [isQueryError]);

  const activeAnalytics = React.useMemo(
    () =>
      analyticsData || {
        total_invested: 0,
        projected_return: 0,
        actual_return: 0,
        active_investments_count: 0,
      },
    [analyticsData]
  );
  const activeChart = React.useMemo(() => chartData || [], [chartData]);
  const activeProposals = React.useMemo(
    () => proposalsResponse?.data?.proposals || [],
    [proposalsResponse]
  );
  const activeRecentInvestments = React.useMemo(
    () => portfolioResponse?.data?.slice(0, 3) || [],
    [portfolioResponse]
  );

  const handleDownload = React.useCallback(() => {
    try {
      const summaryData = [
        { metrik: 'Total Dana Ditanam', nilai: formatCurrency(activeAnalytics.total_invested) },
        { metrik: 'Proyeksi Hasil Panen', nilai: formatCurrency(activeAnalytics.projected_return) },
        { metrik: 'Keuntungan Cair', nilai: formatCurrency(activeAnalytics.actual_return) },
        {
          metrik: 'Proyek Tani Aktif',
          nilai: `${activeAnalytics.active_investments_count} Proyek`,
        },
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
        <div className="flex flex-col gap-6">
          <Skeleton className="w-full h-87.5" />
          <Skeleton className="w-full h-87.5" />
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
      {isAnalyticsError ? (
        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik / Koneksi ke server terputus
        </div>
      ) : (
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
      )}

      {/* Main Content Area: ROI Chart & Recent Investments Table */}
      <div className="flex flex-col gap-6">
        {/* Chart (Full Width) */}
        <Card className="w-full overflow-hidden">
          <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row border-slate-100">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
              <CardTitle className="font-semibold text-base text-slate-900">
                Tren Pertumbuhan Modal & ROI
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Histori kontribusi dana ditanam vs realisasi imbal hasil cair.
              </CardDescription>
            </div>
            <div className="flex border-t border-slate-100 sm:border-t-0 sm:border-l">
              <button
                data-active={activeMetric === 'invested'}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left border-r border-slate-100 last:border-0 hover:bg-slate-50/50 data-[active=true]:bg-slate-50/80 sm:px-8 sm:py-6 min-w-56 cursor-pointer transition-colors"
                onClick={() => setActiveMetric(activeMetric === 'invested' ? 'all' : 'invested')}
              >
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  {chartConfig.invested.label}
                </span>
                <span className="text-base leading-none font-bold sm:text-2xl mt-1 text-slate-800">
                  {formatCurrency(activeAnalytics.total_invested || 0)}
                </span>
              </button>
              <button
                data-active={activeMetric === 'return'}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left border-r border-slate-100 last:border-0 hover:bg-slate-50/50 data-[active=true]:bg-slate-50/80 sm:px-8 sm:py-6 min-w-56 cursor-pointer transition-colors"
                onClick={() => setActiveMetric(activeMetric === 'return' ? 'all' : 'return')}
              >
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  {chartConfig.return.label}
                </span>
                <span className="text-base leading-none font-bold sm:text-2xl mt-1 text-slate-800">
                  {formatCurrency(activeAnalytics.actual_return || 0)}
                </span>
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isChartError ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                Gagal memuat grafik performa ROI / Koneksi ke server terputus
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
                <BarChart
                  accessibilityLayer
                  data={activeChart}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis hide />
                  <ChartTooltip content={<CustomTooltip />} />
                  {(activeMetric === 'all' || activeMetric === 'invested') && (
                    <Bar
                      dataKey="invested"
                      name={chartConfig.invested.label}
                      fill="var(--color-invested)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                  )}
                  {(activeMetric === 'all' || activeMetric === 'return') && (
                    <Bar
                      dataKey="return"
                      name={chartConfig.return.label}
                      fill="var(--color-return)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={28}
                    />
                  )}
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm pt-4 border-t border-slate-100/60 bg-slate-50/10">
            <div className="flex gap-2 leading-none font-medium text-slate-800">
              Imbal hasil aktual terealisasi berkala dengan tren pertumbuhan stabil{' '}
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="leading-none text-muted-foreground text-xs">
              Menampilkan histori dana yang ditanam dan perolehan imbal hasil cair yang terealisasi
            </div>
          </CardFooter>
        </Card>

        {/* Recent Investments (Full Width) */}
        <Card className="flex flex-col w-full overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100/80 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900">
                Investasi Terbaru
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                3 proyek terakhir yang Anda danai dalam platform.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer transition-colors"
              onClick={() => router.push('/dashboard/investor/portfolio')}
            >
              Semua Investasi <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {isPortfolioError ? (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm m-6">
                Gagal memuat data investasi terbaru / Koneksi ke server terputus
              </div>
            ) : (
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="pl-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        ID Transaksi
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Proyek Pertanian
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tanggal Investasi
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Estimasi ROI
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Nominal Investasi
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </TableHead>
                      <TableHead className="pr-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeRecentInvestments.map((inv) => {
                      const isCompleted = inv.status === 'completed';
                      return (
                        <TableRow
                          key={inv.id}
                          className="hover:bg-slate-50/30 transition-colors border-b border-slate-100/80 last:border-0"
                        >
                          <TableCell className="py-4 pl-6">
                            <span className="font-mono text-xs font-bold text-slate-500">
                              {inv.id}
                            </span>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col min-w-[200px]">
                              <span className="font-semibold text-slate-900 text-sm line-clamp-1">
                                {inv.proposal?.title || 'Budidaya Tanaman'}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-bold text-slate-600 uppercase tracking-wide">
                                  {inv.proposal?.commodity || 'Pertanian'}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <span className="text-xs text-slate-600 font-medium">
                              {new Date(inv.invested_at).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-200/50 px-2 py-0.5 rounded">
                              +{inv.proposal?.projected_roi_percent || 0}% ROI
                            </span>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            <span className="font-bold text-slate-900 text-sm">
                              {formatCurrency(inv.amount)}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 whitespace-nowrap">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                                <span className="h-1 w-1 rounded-full bg-emerald-500" />
                                Selesai
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                                <span className="h-1 w-1 rounded-full bg-blue-500" />
                                Aktif
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="py-4 text-right pr-6">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-[11px] font-bold text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-all flex items-center gap-1 ml-auto cursor-pointer"
                              onClick={() => router.push('/dashboard/investor/portfolio')}
                            >
                              Detail <ArrowRight className="h-3 w-3" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
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
        {isProposalsError ? (
          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
            Gagal memuat peluang investasi pertanian / Koneksi ke server terputus
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {activeProposals.slice(0, 3).map((proposal) => (
              <div key={proposal.id} className="min-w-0">
                <ProposalCard proposal={proposal as unknown as Proposal} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
