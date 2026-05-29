'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  FolderUp,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { orderService, Order as ApiOrder, OrderItem as ApiOrderItem } from '@/services/order';
import { exportToCSV } from '@/lib/export-csv';
import { cn } from '@/lib/utils';

export type Order = {
  id: string;
  originalId: string;
  customer: string;
  product: string;
  qty: number;
  amount: number;
  paymentMethod: string;
  status: string;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  paid: { label: 'New Order', className: 'bg-blue-100 text-blue-700' },
  confirmed_seller: {
    label: 'On Progress',
    className: 'bg-yellow-100 text-yellow-700',
  },
  shipped: {
    label: 'On Progress',
    className: 'bg-yellow-100 text-yellow-700',
  },
  delivered: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700',
  },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
};

const columnLabels: Record<string, string> = {
  id: 'ID Pesanan',
  customer: 'Nama Pelanggan',
  product: 'Produk',
  qty: 'Jumlah Barang',
  amount: 'Total Harga',
  paymentMethod: 'Metode Pembayaran',
  status: 'Status',
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => (
      <span className="text-sm font-mono text-muted-foreground">{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'customer',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Pelanggan
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm font-medium">{row.getValue('customer')}</div>
    ),
  },
  {
    accessorKey: 'product',
    header: 'Produk',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('product')}</span>
    ),
  },
  {
    accessorKey: 'qty',
    header: () => <div className="text-center">Jumlah Barang</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm text-muted-foreground">{row.getValue('qty')} Barang</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        <div className="text-right w-full">Total Harga</div>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(row.getValue('amount') as number);
      return <div className="text-center font-medium tabular-nums">{formatted}</div>;
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Metode Pembayaran',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.getValue('paymentMethod')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const config = statusConfig[status] || {
        label: status,
        className: 'bg-gray-100 text-gray-700',
      };
      return (
        <span className={`text-xs px-2 py-1 rounded-md font-medium ${config.className}`}>
          {config.label}
        </span>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function OrderActionsCell({ row }) {
      const order = row.original;
      const router = useRouter();
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(order.originalId);
                  toast.success('ID pesanan berhasil disalin');
                }}
              >
                Salin ID pesanan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/farmer/orders?detail=${order.originalId}`)}
              >
                Lihat detail pesanan
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  toast.info(`Menghubungi ${order.customer}...`, {
                    description: 'Fitur kontak pelanggan akan segera tersedia',
                  });
                }}
              >
                Hubungi pelanggan
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TrackOrderStatus() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [activeStatusFilter, setActiveStatusFilter] = React.useState<string | null>(null);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const {
    data: apiResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['farmer-orders-track'],
    queryFn: () => orderService.getOrders({ limit: 50 }),
  });

  const orders: Order[] = React.useMemo(() => {
    if (!apiResponse?.data?.orders) return [];

    return apiResponse.data.orders.map((o: ApiOrder) => ({
      id: o.id.slice(-6).toUpperCase(),
      originalId: o.id,
      customer: o.buyer?.full_name || 'Pembeli #' + o.buyer_id.slice(-4),
      product: o.items[0] ? 'Produk #' + o.items[0].product_id.slice(-4) : '-',
      qty: o.items.reduce((acc: number, item: ApiOrderItem) => acc + item.quantity, 0),
      amount: o.total_amount,
      paymentMethod: o.payment_url ? 'Online' : 'Manual',
      status: o.status,
    }));
  }, [apiResponse]);

  const filteredOrders = React.useMemo(() => {
    if (!activeStatusFilter) return orders;
    return orders.filter((o) => {
      const mapped = statusConfig[o.status]?.label;
      return mapped === activeStatusFilter;
    });
  }, [orders, activeStatusFilter]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredOrders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [activeStatusFilter, columnFilters]);

  const totalRows = table.getFilteredRowModel().rows.length;
  const fromRow = totalRows === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const toRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalRows);

  const stats = React.useMemo(() => {
    const rawOrders = apiResponse?.data?.orders || [];
    const counts = {
      paid: rawOrders.filter((o: ApiOrder) => o.status === 'paid').length,
      progress: rawOrders.filter((o: ApiOrder) =>
        ['confirmed_seller', 'shipped'].includes(o.status)
      ).length,
      delivered: rawOrders.filter((o: ApiOrder) => o.status === 'delivered').length,
      cancelled: rawOrders.filter((o: ApiOrder) => o.status === 'cancelled').length,
    };

    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekOrders = rawOrders.filter((o: ApiOrder) => {
      const orderDate = new Date(o.created_at);
      return orderDate >= oneWeekAgo && orderDate <= now;
    });

    const lastWeekOrders = rawOrders.filter((o: ApiOrder) => {
      const orderDate = new Date(o.created_at);
      return orderDate >= twoWeeksAgo && orderDate < oneWeekAgo;
    });

    const thisWeekCounts = {
      paid: thisWeekOrders.filter((o: ApiOrder) => o.status === 'paid').length,
      progress: thisWeekOrders.filter((o: ApiOrder) =>
        ['confirmed_seller', 'shipped'].includes(o.status)
      ).length,
      delivered: thisWeekOrders.filter((o: ApiOrder) => o.status === 'delivered').length,
      cancelled: thisWeekOrders.filter((o: ApiOrder) => o.status === 'cancelled').length,
    };

    const lastWeekCounts = {
      paid: lastWeekOrders.filter((o: ApiOrder) => o.status === 'paid').length,
      progress: lastWeekOrders.filter((o: ApiOrder) =>
        ['confirmed_seller', 'shipped'].includes(o.status)
      ).length,
      delivered: lastWeekOrders.filter((o: ApiOrder) => o.status === 'delivered').length,
      cancelled: lastWeekOrders.filter((o: ApiOrder) => o.status === 'cancelled').length,
    };

    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) {
        return current > 0 ? 100 : 0;
      }
      const diff = current - previous;
      const pct = (diff / previous) * 100;
      return Math.round(pct * 10) / 10;
    };

    const changes = {
      paid: calculateChange(thisWeekCounts.paid, lastWeekCounts.paid),
      progress: calculateChange(thisWeekCounts.progress, lastWeekCounts.progress),
      delivered: calculateChange(thisWeekCounts.delivered, lastWeekCounts.delivered),
      cancelled: calculateChange(thisWeekCounts.cancelled, lastWeekCounts.cancelled),
    };

    const total = rawOrders.length || 1;

    return [
      {
        label: 'New Order',
        value: counts.paid,
        change: changes.paid,
        trend: changes.paid >= 0 ? 'up' : 'down',
        progress: (counts.paid / total) * 100,
        barColor: '[&>div]:bg-blue-500',
      },
      {
        label: 'On Progress',
        value: counts.progress,
        change: changes.progress,
        trend: changes.progress >= 0 ? 'up' : 'down',
        progress: (counts.progress / total) * 100,
        barColor: '[&>div]:bg-emerald-500',
      },
      {
        label: 'Completed',
        value: counts.delivered,
        change: changes.delivered,
        trend: changes.delivered >= 0 ? 'up' : 'down',
        progress: (counts.delivered / total) * 100,
        barColor: '[&>div]:bg-green-400',
      },
      {
        label: 'Cancelled',
        value: counts.cancelled,
        change: changes.cancelled,
        trend: changes.cancelled >= 0 ? 'up' : 'down',
        progress: (counts.cancelled / total) * 100,
        barColor: '[&>div]:bg-orange-400',
      },
    ];
  }, [apiResponse]);

  if (error) {
    return (
      <Card className="w-full flex h-80 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 p-6 text-center text-sm font-medium">
        Gagal memuat data pelacakan status pesanan
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <CardTitle>Lacak Status Pesanan</CardTitle>
            <CardDescription>Ringkasan status pesanan terbaru Anda</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/farmer/orders">
              <Button variant="outline" size="sm" className="cursor-pointer">
                Lihat Semua
              </Button>
            </Link>
            <Button
              size="sm"
              className="cursor-pointer"
              onClick={() => {
                if (orders.length === 0) {
                  toast.error('Tidak ada data pesanan untuk di-export');
                  return;
                }

                const statusLabels: Record<string, string> = {
                  paid: 'New Order',
                  confirmed_seller: 'In Progress',
                  shipped: 'Shipped',
                  delivered: 'Completed',
                  cancelled: 'Cancelled',
                };

                exportToCSV({
                  data: orders,
                  columns: [
                    { header: 'ID', accessor: (row) => row.id },
                    { header: 'Pelanggan', accessor: (row) => row.customer },
                    { header: 'Produk', accessor: (row) => row.product },
                    { header: 'Jumlah', accessor: (row) => row.qty },
                    { header: 'Total (IDR)', accessor: (row) => row.amount },
                    { header: 'Metode Pembayaran', accessor: (row) => row.paymentMethod },
                    { header: 'Status', accessor: (row) => statusLabels[row.status] || row.status },
                  ],
                  filename: 'lacak_pesanan',
                });
                toast.success('Data pesanan berhasil di-export');
              }}
            >
              <FolderUp className="mr-1.5 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {stats.map(({ label, value, change, trend, progress, barColor }) => {
            const isActive = activeStatusFilter === label;
            return (
              <button
                key={label}
                onClick={() => setActiveStatusFilter(isActive ? null : label)}
                className={cn(
                  'p-3 rounded-xl border text-left transition-all cursor-pointer select-none space-y-1.5 hover:bg-muted/40',
                  isActive
                    ? 'bg-muted border-slate-300 dark:border-slate-700 shadow-xs animate-pulse'
                    : 'border-transparent bg-transparent'
                )}
              >
                <p className="text-2xl font-semibold leading-none tracking-tight">{value}</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-medium text-muted-foreground">{label}</span>
                  {trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {Math.abs(change)}%
                  </span>
                </div>
                <Progress value={progress} className={`h-1.5 ${barColor}`} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Input
            placeholder="Cari pelanggan..."
            value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('customer')?.setFilterValue(e.target.value)}
            className="flex-1 sm:max-w-sm rounded-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto cursor-pointer">
                Kolom <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="cursor-pointer"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {columnLabels[column.id] || column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-full animate-pulse bg-slate-100 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Belum ada pesanan terbaru.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 mt-4">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-48 animate-pulse bg-slate-100 rounded inline-block" />
            ) : totalRows === 0 ? (
              '0 pesanan ditemukan'
            ) : (
              <>
                Menampilkan{' '}
                <span className="font-semibold text-slate-900">
                  {fromRow}–{toRow}
                </span>{' '}
                dari <span className="font-semibold text-slate-900">{totalRows}</span> pesanan
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-slate-700 bg-white"
              onClick={() => table.previousPage()}
              disabled={isLoading || !table.getCanPreviousPage()}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-slate-700 bg-white"
              onClick={() => table.nextPage()}
              disabled={isLoading || !table.getCanNextPage()}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
