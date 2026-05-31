'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { investmentService, Investment } from '@/services/investment';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Wallet,
  TrendingUp,
  Landmark,
  Eye,
  Search,
  Calendar,
  MoreHorizontal,
  Handshake,
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

  const [activeTab, setActiveTab] = React.useState<'all' | 'paid' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(1);
  const pageSize = 10;

  const {
    data: portfolioResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['investor-portfolio-detail'],
    queryFn: () => investmentService.getPortfolio(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Koneksi ke server portofolio terputus. Gagal memuat data teraktual.');
    }
  }, [isQueryError]);

  const rawInvestments = isQueryError ? MOCK_PORTFOLIO : portfolioResponse?.data || MOCK_PORTFOLIO;

  // Calculate local simulation metrics if backend fails
  const localSummary = React.useMemo(() => {
    const totalInvested = MOCK_PORTFOLIO.reduce((sum, item) => sum + item.amount, 0);
    const totalProjected = MOCK_PORTFOLIO.reduce((sum, item) => sum + item.projected_return, 0);
    const totalActual = MOCK_PORTFOLIO.reduce((sum, item) => sum + (item.actual_return || 0), 0);
    const totalCount = MOCK_PORTFOLIO.length;
    const activeCount = MOCK_PORTFOLIO.filter((item) => item.status === 'paid').length;
    return {
      total_invested: totalInvested,
      total_projected_return: totalProjected,
      total_actual_return: totalActual,
      total_investments: totalCount,
      active_investments_count: activeCount,
    };
  }, []);

  const summary = React.useMemo(() => {
    if (isQueryError || !portfolioResponse) return localSummary;
    const list = portfolioResponse.data || [];
    const activeCount = list.filter((item) => item.status === 'paid').length;
    return {
      total_invested:
        portfolioResponse.message?.total_invested ??
        list.reduce((sum, item) => sum + item.amount, 0),
      total_projected_return:
        portfolioResponse.message?.total_projected_return ??
        list.reduce((sum, item) => sum + item.projected_return, 0),
      total_actual_return:
        portfolioResponse.message?.total_actual_return ??
        list.reduce((sum, item) => sum + (item.actual_return || 0), 0),
      total_investments: portfolioResponse.message?.total_investments ?? list.length,
      active_investments_count: activeCount,
    };
  }, [portfolioResponse, localSummary, isQueryError]);

  // Reset page when tab or search changes
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [activeTab, searchQuery]);

  // Filter list
  const filteredInvestments = React.useMemo(() => {
    return rawInvestments.filter((inv) => {
      const matchesTab = activeTab === 'all' || inv.status === activeTab;
      const matchesSearch =
        inv.proposal?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Skeleton className="h-28 w-full" />
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
      title: 'Total Dana Ditanam',
      value: formatCurrency(summary.total_invested),
      footer: 'Modal investasi terakumulasi',
      icon: Wallet,
      iconColorClass: 'text-emerald-500',
    },
    {
      title: 'Proyeksi Hasil Panen',
      value: formatCurrency(summary.total_projected_return),
      footer: 'Estimasi total imbal hasil',
      icon: TrendingUp,
      iconColorClass: 'text-blue-500',
    },
    {
      title: 'Keuntungan Cair',
      value: formatCurrency(summary.total_actual_return),
      footer: 'Realisasi ROI masuk dompet',
      icon: Landmark,
      iconColorClass: 'text-emerald-500',
    },
    {
      title: 'Proyek Tani Aktif',
      value: `${summary.active_investments_count} Proyek`,
      footer: 'Dalam proses budidaya',
      icon: Calendar,
      iconColorClass: 'text-amber-500',
    },
  ] as const;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
          Portofolio Investasi
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau dan kelola seluruh modal pertanian Anda di ekosistem SmartTani.
        </p>
      </div>

      {/* Summary Metrics (Sesuai Gaya Farmer SectionCard) */}
      {isQueryError ? (
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

      {/* Tabs Filter & Table Container */}
      <Card className="w-full">
        <CardContent className="space-y-4 pt-6">
          {isQueryError ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat daftar portofolio investasi / Koneksi ke server terputus
            </div>
          ) : (
            <>
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
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                      <TableHead className="pl-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Proyek / Proposal
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Komoditas
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Jumlah Investasi
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        ROI Proyeksi
                      </TableHead>
                      <TableHead className="py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        ROI Aktual
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
                        const dateFormatted = new Date(inv.invested_at).toLocaleDateString(
                          'id-ID',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        );

                        return (
                          <TableRow
                            key={inv.id}
                            className="hover:bg-slate-50/30 transition-colors border-b border-slate-100/80 last:border-0"
                          >
                            <TableCell className="py-4 pl-6">
                              <span className="font-semibold text-slate-800 block text-xs line-clamp-1">
                                {inv.proposal?.title || 'Budidaya Tanaman'}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold block mt-0.5 uppercase tracking-wide">
                                Ditempatkan: {dateFormatted}
                              </span>
                            </TableCell>
                            <TableCell className="py-4 text-xs font-semibold text-slate-600">
                              {inv.proposal?.commodity || 'Pertanian'}
                            </TableCell>
                            <TableCell className="py-4 text-xs font-bold text-slate-800">
                              {formatCurrency(Number(inv.amount))}
                            </TableCell>
                            <TableCell className="py-4 text-xs font-bold text-blue-600">
                              +{inv.proposal?.projected_roi_percent || 0}%
                            </TableCell>
                            <TableCell className="py-4 text-xs font-bold">
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
                            <TableCell className="py-4">
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
                            <TableCell className="py-4 text-right pr-6">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 hover:bg-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer"
                                  >
                                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                    <span className="sr-only">Buka menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-44 bg-white border-slate-100 shadow-md"
                                >
                                  <DropdownMenuLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                                    Aksi Investasi
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-slate-50" />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/investor/portfolio/${inv.id || inv.proposal?.id}`
                                      )
                                    }
                                    className="text-xs font-semibold text-slate-700 focus:bg-slate-50 focus:text-slate-900 cursor-pointer py-2 px-3 flex items-center gap-2"
                                  >
                                    <Eye className="h-3.5 w-3.5 text-slate-400" />
                                    Detail Progres
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      router.push(
                                        `/dashboard/investor/proposals/${inv.proposal?.id}`
                                      )
                                    }
                                    className="text-xs font-semibold text-slate-700 focus:bg-slate-50 focus:text-slate-900 cursor-pointer py-2 px-3 flex items-center gap-2"
                                  >
                                    <TrendingUp className="h-3.5 w-3.5 text-slate-400" />
                                    Lihat Proposal
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-slate-50" />
                                  <DropdownMenuItem
                                    onClick={() =>
                                      toast.success('Fitur chat/kontak petani segera hadir!')
                                    }
                                    className="text-xs font-semibold text-slate-600 hover:text-emerald-700 focus:bg-slate-50 focus:text-emerald-700 cursor-pointer py-2 px-3 flex items-center gap-2"
                                  >
                                    <Handshake className="h-3.5 w-3.5 text-slate-400" />
                                    Hubungi Petani
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
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
                      dari <span className="font-semibold text-slate-900">{totalRows}</span>{' '}
                      investasi
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
