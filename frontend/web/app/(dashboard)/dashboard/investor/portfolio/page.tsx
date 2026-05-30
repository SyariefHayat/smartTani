'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { investmentService, Investment } from '@/services/investment';
import { useAuthStore } from '@/stores/auth';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Wallet,
  TrendingUp,
  Landmark,
  Eye,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';

const MOCK_PORTFOLIO = [
  {
    id: 'INV-001',
    amount: 15000000,
    invested_at: '2026-05-20T08:00:00Z',
    status: 'paid',
    projected_return: 17250000,
    actual_return: null,
    proposal: {
      id: 'PROP-01',
      title: 'Budidaya Cabai Merah Keriting Hidroponik',
      commodity: 'Cabai Merah',
      projected_roi_percent: 15,
      duration_days: 120,
    },
  },
  {
    id: 'INV-002',
    amount: 8000000,
    invested_at: '2026-04-12T10:30:00Z',
    status: 'completed',
    projected_return: 9120000,
    actual_return: 9280000,
    proposal: {
      id: 'PROP-02',
      title: 'Pengembangan Perkebunan Tomat Unggul Organik',
      commodity: 'Tomat',
      projected_roi_percent: 14,
      duration_days: 90,
    },
  },
  {
    id: 'INV-003',
    amount: 25000000,
    invested_at: '2026-05-15T14:00:00Z',
    status: 'paid',
    projected_return: 29500000,
    actual_return: null,
    proposal: {
      id: 'PROP-03',
      title: 'Peningkatan Hasil Panen Padi Mentik Wangi',
      commodity: 'Padi',
      projected_roi_percent: 18,
      duration_days: 150,
    },
  },
] as Investment[];

export default function InvestorPortfolioPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  
  const [activeTab, setActiveTab] = React.useState<'all' | 'paid' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const {
    data: portfolioResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['investor-portfolio-detail'],
    queryFn: () => investmentService.getPortfolio(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan portofolio offline. Menggunakan data demo lokal.');
    }
  }, [isQueryError]);

  const rawInvestments = isQueryError ? MOCK_PORTFOLIO : portfolioResponse?.data || MOCK_PORTFOLIO;
  const rawSummary = isQueryError ? null : portfolioResponse?.message;

  // Calculate local simulation metrics if backend fails
  const localSummary = React.useMemo(() => {
    const totalInvested = MOCK_PORTFOLIO.reduce((sum, item) => sum + item.amount, 0);
    const totalProjected = MOCK_PORTFOLIO.reduce((sum, item) => sum + item.projected_return, 0);
    const totalActual = MOCK_PORTFOLIO.reduce((sum, item) => sum + (item.actual_return || 0), 0);
    const totalCount = MOCK_PORTFOLIO.length;
    return {
      total_invested: totalInvested,
      total_projected_return: totalProjected,
      total_actual_return: totalActual,
      total_investments: totalCount,
    };
  }, []);

  const summary = rawSummary || localSummary;

  // Reset page when tab or search changes
  React.useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery]);

  // Filter list
  const filteredInvestments = React.useMemo(() => {
    return rawInvestments.filter((inv) => {
      const matchesTab = activeTab === 'all' || inv.status === activeTab;
      const matchesSearch = inv.proposal?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            inv.proposal?.commodity?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [rawInvestments, activeTab, searchQuery]);

  // Pagination calculations
  const totalRows = filteredInvestments.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const fromRow = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const toRow = Math.min(page * pageSize, totalRows);
  const getCanPreviousPage = page > 1;
  const getCanNextPage = page * pageSize < totalRows;

  const paginatedInvestments = React.useMemo(() => {
    return filteredInvestments.slice((page - 1) * pageSize, page * pageSize);
  }, [filteredInvestments, page]);

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-[350px] w-full" />
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Investasi',
      value: formatCurrency(summary.total_invested),
      footer: `Ditempatkan di ${summary.total_investments} proyek tani`,
      icon: Wallet,
      iconColorClass: 'text-emerald-500',
    },
    {
      title: 'Estimasi Return',
      value: formatCurrency(summary.total_projected_return),
      footer: 'Proyeksi hasil komulatif saat panen',
      icon: TrendingUp,
      iconColorClass: 'text-blue-500',
    },
    {
      title: 'Return Diterima',
      value: formatCurrency(summary.total_actual_return),
      footer: 'Imbal hasil cair ke saldo dompet',
      icon: Landmark,
      iconColorClass: 'text-emerald-500',
    },
  ] as const;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Offline Red Alert Box */}
      {isQueryError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
            <p>
              Layanan Portofolio Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
            onClick={() => refetch()}
          >
            Coba Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">Portofolio Investasi</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau dan kelola seluruh modal pertanian Anda di ekosistem SmartTani.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
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

      {/* Tabs Filter & Table Container */}
      <Card className="w-full">
        <CardContent className="space-y-4 pt-6">
          {/* Filters integrated inside the container card */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-100">
            {/* Search Input */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari Proyek..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 !h-10 text-xs border-slate-200 hover:border-slate-300 focus-visible:ring-emerald-500/30"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/50 h-10 shrink-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 h-full rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveTab('paid')}
                className={`px-4 py-1.5 h-full rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  activeTab === 'paid'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Aktif
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-1.5 h-full rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  activeTab === 'completed'
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Selesai
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6 py-3 text-xs font-semibold text-slate-500">
                    Proyek / Proposal
                  </TableHead>
                  <TableHead className="py-3 text-xs font-semibold text-slate-500">
                    Komoditas
                  </TableHead>
                  <TableHead className="py-3 text-xs font-semibold text-slate-500">
                    Jumlah Investasi
                  </TableHead>
                  <TableHead className="py-3 text-xs font-semibold text-slate-500">
                    ROI Proyeksi
                  </TableHead>
                  <TableHead className="py-3 text-xs font-semibold text-slate-500">
                    ROI Aktual
                  </TableHead>
                  <TableHead className="py-3 text-xs font-semibold text-slate-500">
                    Status
                  </TableHead>
                  <TableHead className="pr-6 py-3 text-right text-xs font-semibold text-slate-500">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvestments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-32 text-center text-xs text-muted-foreground font-medium"
                    >
                      Tidak ada investasi ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInvestments.map((inv: Investment) => {
                    const isCompleted = inv.status === 'completed';
                    const dateFormatted = new Date(inv.invested_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <TableRow
                        key={inv.id}
                        className="hover:bg-slate-50/40 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <TableCell className="py-3.5 pl-6">
                          <span className="font-semibold text-slate-800 block text-xs line-clamp-1">
                            {inv.proposal?.title || 'Budidaya Tanaman'}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">
                            Ditempatkan: {dateFormatted}
                          </span>
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-semibold text-slate-600">
                          {inv.proposal?.commodity || 'Pertanian'}
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-bold text-slate-800">
                          {formatCurrency(Number(inv.amount))}
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-bold text-blue-600">
                          +{inv.proposal?.projected_roi_percent || 0}%
                        </TableCell>
                        <TableCell className="py-3.5 text-xs font-bold">
                          {isCompleted && inv.actual_return ? (
                            <span className="text-green-600">
                              +
                              {(
                                ((Number(inv.actual_return) - Number(inv.amount)) /
                                  Number(inv.amount)) *
                                100
                              ).toFixed(1)}
                              %
                            </span>
                          ) : (
                            <span className="text-slate-400 font-semibold">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Selesai
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                              Aktif
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3.5 text-right pr-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer flex items-center gap-1.5 ml-auto"
                            onClick={() =>
                              router.push(
                                `/dashboard/investor/portfolio/${inv.id || inv.proposal?.id}`
                              )
                            }
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-400" /> Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
            <div className="text-xs text-muted-foreground font-medium">
              {totalRows === 0 ? (
                '0 investasi ditemukan'
              ) : (
                <>
                  Menampilkan{' '}
                  <span className="font-semibold text-slate-900">
                    {fromRow}–{toRow}
                  </span>{' '}
                  dari <span className="font-semibold text-slate-900">{totalRows}</span> investasi
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer text-slate-700 bg-white h-8 text-[11px]"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={!getCanPreviousPage}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer text-slate-700 bg-white h-8 text-[11px]"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={!getCanNextPage}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
