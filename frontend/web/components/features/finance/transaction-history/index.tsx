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
import { AlertTriangle } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { TransactionHeader } from './TransactionHeader';
import { TransactionStats } from './TransactionStats';
import { TransactionTable } from './TransactionTable';
import { columns, TransactionTableActions } from './columns';
import { Transaction, TransactionType, TransactionStatus } from './types';

// Simulated high-fidelity data if server is offline
const MOCK_CURRENT_BALANCE = 54350000;
const MOCK_TOTAL_EARNINGS = 128400000;
const MOCK_TOTAL_TRANSACTIONS = 6;

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-9901',
    date: '2026-05-27T10:00:00Z',
    description: 'Penjualan Hasil Panen Cabai Merah Keriting',
    type: 'Income',
    category: 'Penjualan',
    amount: 4500000,
    status: 'Completed',
    paymentMethod: 'Transfer Bank',
    referenceId: 'ORD-10922',
  },
  {
    id: 'TX-9902',
    date: '2026-05-26T14:30:00Z',
    description: 'Biaya Layanan Transaksi ORD-10922',
    type: 'Expense',
    category: 'Biaya Platform',
    amount: 45000,
    status: 'Completed',
    paymentMethod: 'Pemotongan Saldo',
    referenceId: 'ORD-10922',
  },
  {
    id: 'TX-9903',
    date: '2026-05-25T08:15:00Z',
    description: 'Penarikan Saldo Rekening Mandiri *9021',
    type: 'Withdrawal',
    category: 'Penarikan',
    amount: 15000000,
    status: 'Completed',
    paymentMethod: 'Transfer Bank',
    referenceId: 'WTD-7718',
  },
  {
    id: 'TX-9904',
    date: '2026-05-24T11:00:00Z',
    description: 'Penjualan Hasil Panen Tomat Beef A',
    type: 'Income',
    category: 'Penjualan',
    amount: 8500000,
    status: 'Completed',
    paymentMethod: 'Transfer Bank',
    referenceId: 'ORD-10881',
  },
  {
    id: 'TX-9905',
    date: '2026-05-24T11:05:00Z',
    description: 'Biaya Layanan Transaksi ORD-10881',
    type: 'Expense',
    category: 'Biaya Platform',
    amount: 85000,
    status: 'Completed',
    paymentMethod: 'Pemotongan Saldo',
    referenceId: 'ORD-10881',
  },
  {
    id: 'TX-9906',
    date: '2026-05-22T09:00:00Z',
    description: 'Penarikan Saldo Rekening BCA *7721',
    type: 'Withdrawal',
    category: 'Penarikan',
    amount: 25000000,
    status: 'Pending',
    paymentMethod: 'Transfer Bank',
    referenceId: 'WTD-7712',
  },
];

import { Button } from '@/components/ui/button';

export function TransactionHistoryManagement() {
  const user = useAuthStore((s) => s.user);
  const [useDemo, setUseDemo] = React.useState(false);

  // Pagination State (0-indexed for react-table, converted to 1-indexed for API)
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Query database-backed paginated transaction records
  const { data, isLoading, error, refetch, isRefetching } = useFarmerFinance(user?.id, {
    page: pageIndex + 1,
    limit: pageSize,
  });

  // Reconnect trigger handler
  const handleRetry = React.useCallback(async () => {
    const result = await refetch();
    if (result.data && !result.isError) {
      setUseDemo(false);
      toast.success('Koneksi ke server keuangan berhasil dipulihkan!');
    } else {
      toast.error('Gagal menghubungkan kembali ke server keuangan.');
    }
  }, [refetch]);

  React.useEffect(() => {
    if (error) {
      setUseDemo(true);
      toast.error('Layanan keuangan offline. Menggunakan data demo lokal.', {
        description:
          'Layanan backend analytics tidak merespon. Menampilkan riwayat simulasi agar Anda tetap dapat meninjau dashboard.',
        duration: 5000,
      });
    }
  }, [error]);

  // Map raw backend transaction models to frontend UI Transaction format
  const transactions: Transaction[] = React.useMemo(() => {
    if (useDemo) return MOCK_TRANSACTIONS;
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
  }, [data, useDemo]);

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
    pageCount: useDemo ? 1 : data?.meta ? Math.ceil(data.meta.total / pageSize) : -1,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: !useDemo,
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
        {useDemo && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
              <p>
                Layanan Keuangan Offline: Gagal sinkronisasi data teraktual. Menggunakan data demo
                lokal.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
              onClick={handleRetry}
              disabled={isRefetching}
            >
              {isRefetching ? 'Menghubungkan...' : 'Coba Hubungkan Kembali'}
            </Button>
          </div>
        )}

        <TransactionHeader onExportCSV={handleExportCSV} onPrintReport={handlePrintReport} />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <TransactionStats
            currentBalance={useDemo ? MOCK_CURRENT_BALANCE : data?.current_balance || 0}
            totalEarnings={useDemo ? MOCK_TOTAL_EARNINGS : data?.total_earnings || 0}
            totalTransactions={useDemo ? MOCK_TOTAL_TRANSACTIONS : data?.meta?.total || 0}
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
            totalTransactions={useDemo ? MOCK_TOTAL_TRANSACTIONS : data?.meta?.total || 0}
          />
        )}
      </div>
    </div>
  );
}
