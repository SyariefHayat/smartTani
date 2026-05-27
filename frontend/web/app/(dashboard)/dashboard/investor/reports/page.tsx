'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { investmentService } from '@/services/investment';
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
import { FileDown, Calendar, AlertTriangle, RefreshCw, Layers } from 'lucide-react';

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
    refetch,
  } = useQuery({
    queryKey: ['investor-reports-list'],
    queryFn: () => investmentService.getPortfolio(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan laporan offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data laporan simulasi agar Anda tetap dapat mengekspor layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawInvestments = isQueryError
    ? MOCK_REPORT_INVESTMENTS
    : portfolioResponse?.data || MOCK_REPORT_INVESTMENTS;

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
      } catch (err) {
        toast.dismiss();
        toast.error('Gagal mengekspor laporan');
      }
    }, 1200);
  };

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
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
              <p className="text-xs font-bold">Layanan Laporan Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data laporan simulasi. Anda tetap dapat melakukan uji ekspor berkas CSV
                secara lokal.
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Laporan Investasi</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Hasilkan laporan audit keuangan portofolio Anda untuk kebutuhan rekonsiliasi atau pajak.
          </p>
        </div>
        <Button
          onClick={handleExportCSV}
          className="h-9 text-xs font-bold bg-green-600 hover:bg-green-700 text-white cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <FileDown className="h-4 w-4" /> Ekspor Laporan (CSV)
        </Button>
      </div>

      {/* Reports Table Container */}
      <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Rekapitulasi Modal & Bagi Hasil
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Daftar transaksi pendanaan beserta proyeksi imbal hasil terkontrak.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/75 border-b border-slate-100">
              <TableRow>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider pl-6">
                  ID Investasi
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Nama Proyek
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Komoditas
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Investasi Pokok
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Estimasi Return
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                  Bagi Hasil Aktual
                </TableHead>
                <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
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
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="py-4 pl-6 font-mono text-xs font-semibold text-slate-500">
                      #{inv.id}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-semibold text-slate-800 max-w-xs truncate">
                      {inv.proposal.title}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-medium text-slate-500">
                      {inv.proposal.commodity}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold text-slate-800">
                      {formatCurrency(inv.amount)}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold text-blue-600">
                      {formatCurrency(inv.projected_return)}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-bold">
                      {isCompleted && inv.actual_return ? (
                        <span className="text-green-600">{formatCurrency(inv.actual_return)}</span>
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
                            isCompleted ? 'bg-emerald-500' : 'bg-blue-500'
                          }`}
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
  );
}
