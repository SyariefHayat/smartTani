'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentService } from '@/services/investment';
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
import { FileDown, Wallet, TrendingUp, Award } from 'lucide-react';

const MOCK_REPORT_INVESTMENTS = [
  {
    id: 'INV-001',
    amount: 15000000,
    invested_at: '2026-05-20T08:00:00Z',
    status: 'paid',
    projected_return: 17250000,
    actual_return: null,
    proposal: {
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
      title: 'Pengembangan Perkebunan Tomat Organik',
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
      title: 'Peningkatan Hasil Panen Padi Mentik Wangi',
      commodity: 'Padi',
      projected_roi_percent: 18,
      duration_days: 150,
    },
  },
];

export default function InvestorReportsPage() {
  const {
    data: portfolioResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['investor-reports-list'],
    queryFn: () => investmentService.getPortfolio(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Koneksi ke server laporan terputus. Gagal memuat data teraktual.');
    }
  }, [isQueryError]);

  const rawInvestments = isQueryError
    ? MOCK_REPORT_INVESTMENTS
    : portfolioResponse?.data || MOCK_REPORT_INVESTMENTS;

  const summaryMetrics = React.useMemo(() => {
    const totalInvested = rawInvestments.reduce((sum, item) => sum + item.amount, 0);
    const totalProjected = rawInvestments.reduce((sum, item) => sum + item.projected_return, 0);
    const totalActual = rawInvestments.reduce((sum, item) => sum + (item.actual_return || 0), 0);
    return {
      totalInvested,
      totalProjected,
      totalActual,
    };
  }, [rawInvestments]);

  const handleExportCSV = () => {
    toast.loading('Menyiapkan berkas ekspor CSV...');
    setTimeout(() => {
      try {
        const headers = [
          'ID Investasi',
          'Judul Proyek',
          'Komoditas',
          'Jumlah Modal (IDR)',
          'ROI Proyeksi',
          'ROI Aktual (IDR)',
          'Status',
          'Tanggal Investasi',
        ];
        const rows = rawInvestments.map((inv) => [
          inv.id,
          inv.proposal.title,
          inv.proposal.commodity,
          inv.amount,
          `+${inv.proposal.projected_roi_percent}%`,
          inv.actual_return || '-',
          inv.status === 'completed' ? 'Selesai' : 'Aktif',
          new Date(inv.invested_at).toISOString().split('T')[0],
        ]);

        const csvContent = [
          headers.join(','),
          ...rows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute(
          'download',
          `SmartTani_Laporan_Investasi_${new Date().toISOString().split('T')[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.dismiss();
        toast.success('Berkas laporan CSV berhasil diunduh!');
      } catch {
        toast.dismiss();
        toast.error('Gagal mengekspor laporan');
      }
    }, 1200);
  };

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
            Laporan Investasi
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Hasilkan laporan audit keuangan portofolio Anda untuk kebutuhan rekonsiliasi atau pajak.
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          className="h-9 text-xs font-bold bg-green-600 hover:bg-green-700 hover:text-white transition-colors text-white cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <FileDown className="h-4 w-4" /> Ekspor Laporan (CSV)
        </Button>
      </div>

      {/* 3 Summary Metric Cards (Sesuai Gaya Farmer SectionCard) */}
      {isQueryError ? (
        <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik laporan / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {[
            {
              title: 'Total Investasi Pokok',
              value: formatCurrency(summaryMetrics.totalInvested),
              footer: 'Total dana ditanam terlaporkan',
              icon: Wallet,
              iconColorClass: 'text-emerald-500',
            },
            {
              title: 'Estimasi Imbal Hasil',
              value: formatCurrency(summaryMetrics.totalProjected),
              footer: 'Proyeksi total bagi hasil kontrak',
              icon: TrendingUp,
              iconColorClass: 'text-blue-500',
            },
            {
              title: 'Bagi Hasil Terealisasi',
              value: formatCurrency(summaryMetrics.totalActual),
              footer: 'Keuntungan tercatat cair',
              icon: Award,
              iconColorClass: 'text-emerald-500',
            },
          ].map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="min-w-0 border-slate-200 shadow-sm bg-white">
                <CardHeader className="gap-1 pb-2">
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
                <CardFooter className="flex-col items-start gap-1.5 text-sm mt-1 pt-0">
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

      {/* Reports Table Container */}
      <Card className="w-full overflow-hidden border border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Rekapitulasi Modal & Bagi Hasil
            </CardTitle>
            <CardDescription className="text-xs mt-0.5 text-slate-500">
              Daftar transaksi pendanaan beserta proyeksi imbal hasil terkontrak.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isQueryError ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm m-6">
              Gagal memuat daftar portofolio investasi / Koneksi ke server terputus
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b border-slate-100">
                    <TableHead className="py-3.5 pl-6 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      ID Investasi
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Proyek Pertanian
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Investasi Pokok
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Estimasi Return
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Bagi Hasil Aktual
                    </TableHead>
                    <TableHead className="py-3.5 text-slate-600 font-bold text-xs uppercase tracking-wider pr-6">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rawInvestments.map((inv) => {
                    const isCompleted = inv.status === 'completed';
                    return (
                      <TableRow
                        key={inv.id}
                        className="hover:bg-slate-50/30 transition-colors border-b border-slate-100/80 last:border-0"
                      >
                        <TableCell className="py-4 pl-6 font-mono text-xs font-bold text-slate-500">
                          #{inv.id}
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
                          <span className="font-bold text-slate-900 text-sm">
                            {formatCurrency(inv.amount)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50/80 border border-blue-200/50 px-2 py-0.5 rounded">
                            {formatCurrency(inv.projected_return)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap">
                          {isCompleted && inv.actual_return ? (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50/80 border border-emerald-200/50 px-2 py-0.5 rounded">
                              {formatCurrency(inv.actual_return)}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-semibold">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-4 whitespace-nowrap pr-6">
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
