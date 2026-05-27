'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { investmentService, Investment } from '@/services/investment';
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
import {
  Wallet,
  TrendingUp,
  Landmark,
  PieChart,
  Eye,
  AlertTriangle,
  RefreshCw,
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
      toast.error('Layanan portofolio offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan data portofolio simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
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

  // Filter list
  const filteredInvestments = React.useMemo(() => {
    return rawInvestments.filter((inv) => {
      if (activeTab === 'all') return true;
      return inv.status === activeTab;
    });
  }, [rawInvestments, activeTab]);

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-[350px] w-full" />
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
              <p className="text-xs font-bold">Layanan Investasi Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data portofolio simulasi. Beberapa perubahan data hanya akan disimpan
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Portofolio Investasi</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau dan kelola seluruh modal pertanian Anda di ekosistem SmartTani.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Investasi
            </CardDescription>
            <Wallet className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800 tabular-nums lg:text-2xl">
              {formatCurrency(summary.total_invested)}
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">
              Ditempatkan di {summary.total_investments} proyek tani
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Estimasi Return
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-blue-600 tabular-nums lg:text-2xl">
              {formatCurrency(summary.total_projected_return)}
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">
              Proyeksi hasil komulatif saat panen
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Return Diterima
            </CardDescription>
            <Landmark className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-emerald-600 tabular-nums lg:text-2xl">
              {formatCurrency(summary.total_actual_return)}
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">
              Imbal hasil yang sudah cair ke saldo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Filter & Table Container */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Investasi Saya
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Seluruh riwayat pendanaan proyek tani Anda.
            </CardDescription>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setActiveTab('paid')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                activeTab === 'paid'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Aktif
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                activeTab === 'completed'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Selesai
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredInvestments.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <PieChart className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60" />
              <p className="text-xs font-bold text-slate-700">Tidak Ada Investasi Ditemukan</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Anda belum menempatkan dana pada kategori filter ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/75 border-b border-slate-100">
                  <TableRow>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider pl-6">
                      Proyek / Proposal
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Komoditas
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Jumlah Investasi
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      ROI Proyeksi
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      ROI Aktual
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider text-right pr-6">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvestments.map((inv: Investment) => {
                    const isCompleted = inv.status === 'completed';
                    const dateFormatted = new Date(inv.invested_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });

                    return (
                      <TableRow
                        key={inv.id}
                        className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <TableCell className="py-4 pl-6">
                          <span className="font-semibold text-slate-800 block text-xs line-clamp-1">
                            {inv.proposal.title}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                            Ditempatkan: {dateFormatted}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-xs font-semibold text-slate-600">
                          {inv.proposal.commodity}
                        </TableCell>
                        <TableCell className="py-4 text-xs font-bold text-slate-800">
                          {formatCurrency(Number(inv.amount))}
                        </TableCell>
                        <TableCell className="py-4 text-xs font-bold text-blue-600">
                          +{inv.proposal.projected_roi_percent}%
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
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isCompleted ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'
                              }`}
                            />
                            {isCompleted ? 'Selesai' : 'Aktif'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                            onClick={() =>
                              router.push(
                                `/dashboard/investor/portfolio/${inv.id || inv.proposal.id}`
                              )
                            }
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-400" /> Detail
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
  );
}
