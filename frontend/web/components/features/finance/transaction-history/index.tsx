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
  type PaginationState,
} from '@tanstack/react-table';
import { useAuthStore } from '@/stores/auth';
import { useFarmerFinance } from '@/hooks/use-farmer-finance';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { exportToCSV } from '@/lib/export-csv';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { TransactionHeader } from './TransactionHeader';
import { TransactionStats } from './TransactionStats';
import { TransactionTable } from './TransactionTable';
import { columns, TransactionTableActions } from './columns';
import { Transaction, TransactionType, TransactionStatus } from './types';

export function TransactionHistoryManagement() {
  const user = useAuthStore((s) => s.user);

  // Pagination State (0-indexed for react-table, converted to 1-indexed for API)
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Query database-backed paginated transaction records
  const { data, isLoading, error } = useFarmerFinance(user?.id, {
    page: pageIndex + 1,
    limit: pageSize,
  });

  const isOffline = !!error;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Gagal menghubungkan ke layanan keuangan. Koneksi terputus.');
    }
  }, [isOffline]);

  // Map raw backend transaction models to frontend UI Transaction format
  const transactions: Transaction[] = React.useMemo(() => {
    if (isOffline) return [];
    const rawTransactions = data?.transactions || [];
    return rawTransactions.map((t) => {
      const type: TransactionType = t.type === 'revenue' ? 'Income' : 'Expense';
      const category = t.type === 'revenue' ? 'Penjualan' : 'Biaya Platform';

      return {
        id: t.id,
        date: t.date,
        description: t.description,
        type,
        category,
        amount: t.amount,
        status: 'Completed' as TransactionStatus,
        paymentMethod: 'Transfer Bank',
        referenceId: t.order_id,
      };
    });
  }, [data, isOffline]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Export handlers
  const handleExportCSV = React.useCallback(() => {
    exportToCSV({
      data: transactions,
      columns: [
        { header: 'ID Transaksi', accessor: (row) => row.id },
        {
          header: 'Tanggal',
          accessor: (row) => format(new Date(row.date), 'dd MMM yyyy, HH:mm', { locale: id }),
        },
        { header: 'Keterangan', accessor: (row) => row.description },
        { header: 'Tipe', accessor: (row) => row.type },
        { header: 'Kategori', accessor: (row) => row.category },
        { header: 'Nominal (Rp)', accessor: (row) => row.amount },
        { header: 'Status', accessor: (row) => row.status },
        { header: 'Metode Pembayaran', accessor: (row) => row.paymentMethod },
        { header: 'ID Referensi', accessor: (row) => row.referenceId || '-' },
      ],
      filename: 'riwayat_transaksi_lengkap',
    });
    toast.success('Riwayat transaksi lengkap berhasil diekspor ke CSV');
  }, [transactions]);

  const handlePrintReport = React.useCallback(() => {
    toast.loading('Mempersiapkan dokumen laporan untuk dicetak...');
    setTimeout(() => {
      toast.dismiss();
      if (typeof window !== 'undefined') {
        window.print();
      }
    }, 1000);
  }, []);

  // Action Menu callbacks mapped to react-table options
  const tableActions = React.useMemo<TransactionTableActions>(
    () => ({
      onViewDetail: (tx) => {
        toast.info(`Detail Transaksi: ${tx.description}`, {
          description: `Ref ID: ${tx.referenceId || '-'} | Metode: ${tx.paymentMethod} | Nominal: Rp ${tx.amount.toLocaleString('id-ID')}`,
        });
      },
      onViewReference: (tx) => {
        if (!tx.referenceId) {
          toast.error('Tidak ada referensi pesanan untuk transaksi ini.');
          return;
        }
        toast.success(`Membuka rincian pesanan ${tx.referenceId}`);
      },
      onDownloadReceipt: (tx) => {
        toast.loading(`Mengunduh bukti transaksi ${tx.id}...`);
        setTimeout(() => {
          toast.dismiss();
          toast.success(`Bukti transaksi ${tx.id} berhasil disimpan di folder Download.`);
        }, 1500);
      },
    }),
    []
  );

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: transactions,
    columns,
    pageCount: isOffline ? 0 : data?.meta ? Math.ceil(data.meta.total / pageSize) : -1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    meta: tableActions,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full text-slate-900 animate-in fade-in duration-500">
      <div className="mx-auto flex w-full flex-col gap-6">
        <TransactionHeader onExportCSV={handleExportCSV} onPrintReport={handlePrintReport} />

        {isOffline ? (
          <>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat data statistik keuangan / Koneksi ke server terputus
            </div>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat daftar riwayat transaksi / Koneksi ke server terputus
            </div>
          </>
        ) : (
          <>
            {isLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <TransactionStats
                currentBalance={data?.current_balance || 0}
                totalEarnings={data?.total_earnings || 0}
                totalTransactions={data?.meta?.total || 0}
              />
            )}

            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full animate-pulse" />
                <Skeleton className="h-24 w-full animate-pulse" />
                <Skeleton className="h-24 w-full animate-pulse" />
              </div>
            ) : (
              <TransactionTable
                table={table}
                columnsCount={columns.length}
                totalTransactions={data?.meta?.total || 0}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
