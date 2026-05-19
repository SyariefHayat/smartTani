'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/auth';
import { orderService } from '@/services/order';
import { OrderHeader } from './OrderHeader';
import { OrderStats } from './OrderStats';
import { OrderFilters } from './OrderFilters';
import { OrderTable } from './OrderTable';
import { columns } from './columns';
import { FarmerOrder, OrderStatus } from './types';

export function FarmerIncomingOrderList() {
  const user = useAuthStore((s) => s.user);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['farmer-orders', user?.id, pagination.pageIndex, pagination.pageSize, columnFilters],
    queryFn: async () => {
      if (!user?.id) return null;

      const status = columnFilters.find((f) => f.id === 'status')?.value as string;

      return orderService.getOrders({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: status || undefined,
      });
    },
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(
        'Gagal mengambil data pesanan: ' +
          (error instanceof Error ? error.message : 'Terjadi kesalahan')
      );
    }
  }, [isError, error]);

  const orders: FarmerOrder[] = React.useMemo(() => {
    if (!data?.data?.orders) return [];

    return data.data.orders.map((o) => ({
      id: o.id,
      customerName: o.buyer?.full_name || 'Pembeli #' + o.buyer_id.slice(-4),
      date: o.created_at,
      totalAmount: o.total_amount,
      paymentMethod: o.payment_url ? 'Online Payment' : 'Manual',
      status: o.status as OrderStatus,
      items: o.items.map((item) => ({
        id: item.id,
        name: 'Produk #' + item.product_id.slice(-4), // Fallback if name not in item
        quantity: item.quantity,
        price: item.price_per_unit,
        image: '',
      })),
    }));
  }, [data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: data?.data?.pagination?.pages ?? -1,
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
        <OrderHeader />
        <OrderStats orders={orders} />
        <div className="space-y-4">
          <OrderFilters table={table} />
          {isLoading ? (
            <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-slate-200">
              <span className="text-sm text-slate-500 animate-pulse">Memuat data pesanan...</span>
            </div>
          ) : (
            <OrderTable
              table={table}
              columnsCount={columns.length}
              totalRows={data?.data?.pagination?.total}
            />
          )}
        </div>
      </div>
    </div>
  );
}
