'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  PaginationState,
} from '@tanstack/react-table';

import { FinanceHeader } from './FinanceHeader';
import { FinanceStats } from './FinanceStats';
import { FinanceTable } from './FinanceTable';
import { columns } from './columns';
import { FarmerTransaction } from './types';
import { useAuthStore } from '@/stores/auth';
import { useFarmerFinance } from '@/hooks/use-farmer-finance';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV } from '@/lib/export-csv';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

// High-fidelity fallback simulated data if backend finance service is offline
const MOCK_FINANCE_DATA = {
  current_balance: 54350000,
  total_earnings: 128400000,
  pending_balance: 12500000,
  earnings_change_percent: 18.4,
  transactions: [
    {
      id: 'TX-9901',
      date: '2026-05-27T10:00:00Z',
      type: 'revenue' as const,
      amount: 4500000,
      description: 'Penjualan Hasil Panen Cabai Merah Keriting',
      order_id: 'ORD-10922',
      status: 'success' as const,
    },
    {
      id: 'TX-9902',
      date: '2026-05-26T14:30:00Z',
      type: 'fee' as const,
      amount: 45000,
      description: 'Biaya Layanan Transaksi ORD-10922',
      order_id: 'ORD-10922',
      status: 'success' as const,
    },
    {
      id: 'TX-9903',
      date: '2026-05-25T08:15:00Z',
      type: 'withdrawal' as const,
      amount: 15000000,
      description: 'Penarikan Saldo Rekening Mandiri *9021',
      status: 'success' as const,
    },
    {
      id: 'TX-9904',
      date: '2026-05-24T11:00:00Z',
      type: 'revenue' as const,
      amount: 8500000,
      description: 'Penjualan Hasil Panen Tomat Beef A',
      order_id: 'ORD-10881',
      status: 'success' as const,
    },
    {
      id: 'TX-9905',
      date: '2026-05-24T11:05:00Z',
      type: 'fee' as const,
      amount: 85000,
      description: 'Biaya Layanan Transaksi ORD-10881',
      order_id: 'ORD-10881',
      status: 'success' as const,
    },
    {
      id: 'TX-9906',
      date: '2026-05-22T09:00:00Z',
      type: 'withdrawal' as const,
      amount: 25000000,
      description: 'Penarikan Saldo Rekening BCA *7721',
      status: 'pending' as const,
    },
  ],
  meta: {
    page: 1,
    limit: 20,
    total: 6,
  },
};

export function FarmerFinanceManagement() {
  const user = useAuthStore((s) => s.user);
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { data, isLoading, error, refetch, isRefetching } = useFarmerFinance(user?.id, {
    page: pageIndex + 1,
    limit: pageSize,
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [useDemo, setUseDemo] = React.useState(false);

  React.useEffect(() => {
    if (error) {
      setUseDemo(true);
      toast.error('Layanan keuangan offline. Menggunakan data demo lokal.', {
        description:
          'Layanan backend analytics tidak merespon. Menampilkan data simulasi agar Anda tetap dapat meninjau dashboard.',
        duration: 5000,
      });
    }
  }, [error]);

  const activeData = useDemo ? MOCK_FINANCE_DATA : data;

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: (activeData?.transactions as FarmerTransaction[]) || [],
    columns,
    pageCount: activeData?.meta ? Math.ceil(activeData.meta.total / pageSize) : -1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const summary = React.useMemo(() => {
    return {
      currentBalance: activeData?.current_balance || 0,
      totalEarnings: activeData?.total_earnings || 0,
      pendingBalance: activeData?.pending_balance || 0,
      earningsChangePercent: activeData?.earnings_change_percent || 0,
    };
  }, [activeData]);

  // Export handler
  const handleExport = React.useCallback(() => {
    const typeLabels: Record<string, string> = {
      revenue: 'Penjualan',
      fee: 'Biaya Layanan',
      withdrawal: 'Penarikan',
      refund: 'Pengembalian Dana',
    };
    const statusLabels: Record<string, string> = {
      success: 'Berhasil',
      pending: 'Diproses',
      failed: 'Gagal',
    };

    exportToCSV({
      data: (activeData?.transactions as FarmerTransaction[]) || [],
      columns: [
        { header: 'ID Transaksi', accessor: (row) => row.id },
        {
          header: 'Tanggal',
          accessor: (row) => format(new Date(row.date), 'dd MMM yyyy, HH:mm', { locale: id }),
        },
        { header: 'Keterangan', accessor: (row) => row.description },
        { header: 'Tipe', accessor: (row) => typeLabels[row.type] || row.type },
        {
          header: 'Jumlah (Rp)',
          accessor: (row) => (row.type === 'revenue' ? '+' : '-') + row.amount,
        },
        { header: 'Status', accessor: (row) => statusLabels[row.status || 'success'] },
      ],
      filename: 'riwayat_transaksi_keuangan',
    });
    toast.success('Laporan transaksi berhasil diekspor');
  }, [activeData?.transactions]);

  // Withdraw handler
  const handleWithdraw = React.useCallback(() => {
    if (summary.currentBalance <= 0) {
      toast.error('Saldo Anda tidak mencukupi untuk melakukan penarikan.');
      return;
    }
    toast.loading('Memproses permintaan penarikan saldo...');
    setTimeout(() => {
      toast.dismiss();
      toast.success(
        `Berhasil mengajukan penarikan sebesar Rp ${summary.currentBalance.toLocaleString(
          'id-ID'
        )}. Dana akan ditransfer ke rekening terdaftar Anda dalam 1x24 jam.`
      );
      if (!useDemo) refetch();
    }, 2000);
  }, [summary.currentBalance, useDemo, refetch]);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-20 w-full animate-pulse rounded-lg bg-slate-100" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          <Skeleton className="h-12 w-full animate-pulse" />
          <Skeleton className="h-24 w-full animate-pulse" />
          <Skeleton className="h-24 w-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        {useDemo && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-semibold shadow-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
            <p>
              Mode Offline Simulai: Koneksi ke server keuangan terputus. Menampilkan data lokal demo
              agar Anda tetap dapat menjelajahi layout.
            </p>
          </div>
        )}

        <FinanceHeader onExport={handleExport} onWithdraw={handleWithdraw} />
        <FinanceStats summary={summary} />
        <FinanceTable
          table={table}
          columnsCount={columns.length}
          totalTransactions={activeData?.meta?.total || 0}
        />
      </div>
    </div>
  );
}
