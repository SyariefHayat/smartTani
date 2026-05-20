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

import { TransactionHeader } from './TransactionHeader';
import { TransactionStats } from './TransactionStats';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import { columns } from './columns';
import { Transaction, TransactionType, TransactionStatus } from './types';

export function TransactionHistoryManagement() {
  const user = useAuthStore((s) => s.user);

  // Pagination State (0-indexed for react-table, converted to 1-indexed for API)
  const [{ pageIndex, pageSize }, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  // Query database-backed paginated transaction records
  const { data, isLoading, error } = useFarmerFinance(user?.id, {
    page: pageIndex + 1,
    limit: pageSize,
  });

  React.useEffect(() => {
    if (error) {
      toast.error('Gagal memuat data riwayat transaksi');
    }
  }, [error]);

  // Map raw backend transaction models to frontend UI Transaction format
  const transactions: Transaction[] = React.useMemo(() => {
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
  }, [data]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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
    pageCount: data?.meta ? Math.ceil(data.meta.total / pageSize) : -1,
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

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <TransactionHeader />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <TransactionStats
            currentBalance={data?.current_balance || 0}
            totalEarnings={data?.total_earnings || 0}
            pendingBalance={data?.pending_balance || 0}
            totalTransactions={data?.meta?.total || 0}
          />
        )}

        <div className="space-y-4">
          <TransactionFilters table={table} />

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded" />
              ))}
            </div>
          ) : (
            <TransactionTable table={table} columnsCount={columns.length} />
          )}
        </div>
      </div>
    </div>
  );
}
