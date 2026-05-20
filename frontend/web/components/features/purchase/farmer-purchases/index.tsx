'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';

import { PurchaseHeader } from './PurchaseHeader';
import { PurchaseStats } from './PurchaseStats';
import { PurchaseFilters } from './PurchaseFilters';
import { PurchaseTable } from './PurchaseTable';
import { columns } from './columns';
import { purchaseService } from '@/services/purchase';
import { Skeleton } from '@/components/ui/skeleton';

export function FarmerPurchaseList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const {
    data: purchases = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['farmer-purchases'],
    queryFn: () => purchaseService.getPurchases(),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: purchases,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="text-destructive font-medium">Gagal mengambil data pengeluaran</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-green-600 hover:underline font-medium"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <PurchaseHeader />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <PurchaseStats purchases={purchases} />
        )}

        <div className="space-y-4">
          <PurchaseFilters table={table} />
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <PurchaseTable table={table} columnsCount={columns.length} />
          )}
        </div>
      </div>
    </div>
  );
}
