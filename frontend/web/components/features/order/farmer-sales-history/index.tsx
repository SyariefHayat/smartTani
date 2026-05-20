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
import { orderService } from '@/services/order';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

import { SalesHistoryHeader } from './SalesHistoryHeader';
import { SalesHistoryStats } from './SalesHistoryStats';
import { SalesHistoryFilters } from './SalesHistoryFilters';
import { SalesHistoryTable } from './SalesHistoryTable';
import { columns } from './columns';
import { FarmerOrder, OrderStatus } from '../farmer-orders/types';

export function FarmerSalesHistory() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // 1. Fetch Orders with target statuses (delivered, completed, cancelled)
  const {
    data: ordersResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['farmer-sales-history'],
    queryFn: async () => orderService.getOrders({ status: 'delivered,completed,cancelled' }),
  });

  React.useEffect(() => {
    if (error) {
      toast.error('Gagal mengambil data riwayat pesanan');
    }
  }, [error]);

  // 2. Map backend Order type to UI FarmerOrder type
  const orders: FarmerOrder[] = React.useMemo(() => {
    const rawOrders = ordersResponse?.data?.orders || [];
    return rawOrders.map((o) => {
      const items = o.items.map((item) => ({
        id: item.id,
        name: `Produk #${item.product_id.slice(-4)}`,
        quantity: item.quantity,
        price: item.price_per_unit,
        image: '',
      }));

      return {
        id: o.id,
        customerName: o.buyer?.full_name || `Pembeli #${o.buyer_id.slice(-4)}`,
        date: o.created_at,
        totalAmount: o.total_amount,
        paymentMethod: o.payment_url ? 'Online (Midtrans)' : 'Manual',
        status: o.status as OrderStatus,
        items,
      };
    });
  }, [ordersResponse]);

  // 3. Setup React Table
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
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

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-8">
        <SalesHistoryHeader />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <SalesHistoryStats orders={orders} />
        )}

        <div className="space-y-6">
          <SalesHistoryFilters table={table} />

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <SalesHistoryTable table={table} columnsCount={columns.length} />
          )}
        </div>
      </div>
    </div>
  );
}
