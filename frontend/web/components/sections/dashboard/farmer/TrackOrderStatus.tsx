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
import { useQuery } from '@tanstack/react-query';

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

export type Order = {
  id: string;
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
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-700',
  },
  shipped: {
    label: 'In Progress',
    className: 'bg-yellow-100 text-yellow-700',
  },
  delivered: {
    label: 'Completed',
    className: 'bg-emerald-100 text-emerald-700',
  },
  cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
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
    cell: ({ row }) => {
      const order = row.original;
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
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(order.id)}>
                Salin ID pesanan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem>Lihat detail pesanan</DropdownMenuItem>
              <DropdownMenuItem>Hubungi pelanggan</DropdownMenuItem>
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

  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ['farmer-orders-track'],
    queryFn: () => orderService.getOrders({ limit: 10 }),
  });

  const orders: Order[] = React.useMemo(() => {
    if (!apiResponse?.data?.orders) return [];

    return apiResponse.data.orders.map((o: ApiOrder) => ({
      id: o.id.slice(-6).toUpperCase(),
      customer: o.buyer?.full_name || 'Pembeli #' + o.buyer_id.slice(-4),
      product: o.items[0] ? 'Produk #' + o.items[0].product_id.slice(-4) : '-',
      qty: o.items.reduce((acc: number, item: ApiOrderItem) => acc + item.quantity, 0),
      amount: o.total_amount,
      paymentMethod: o.payment_url ? 'Online' : 'Manual',
      status: o.status,
    }));
  }, [apiResponse]);

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

    const total = rawOrders.length || 1;

    return [
      {
        label: 'New Order',
        value: counts.paid,
        change: 0.5,
        trend: 'up',
        progress: (counts.paid / total) * 100,
        barColor: '[&>div]:bg-blue-500',
      },
      {
        label: 'On Progress',
        value: counts.progress,
        change: 0.3,
        trend: 'down',
        progress: (counts.progress / total) * 100,
        barColor: '[&>div]:bg-emerald-500',
      },
      {
        label: 'Completed',
        value: counts.delivered,
        change: 0.5,
        trend: 'up',
        progress: (counts.delivered / total) * 100,
        barColor: '[&>div]:bg-green-400',
      },
      {
        label: 'Cancelled',
        value: counts.cancelled,
        change: 0.5,
        trend: 'down',
        progress: (counts.cancelled / total) * 100,
        barColor: '[&>div]:bg-orange-400',
      },
    ];
  }, [apiResponse]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lacak Status Pesanan</CardTitle>
            <CardDescription>Ringkasan status pesanan terbaru Anda</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/farmer/orders">
              <Button variant="outline" size="sm">
                Lihat Semua
              </Button>
            </Link>
            <Button size="sm">
              <FolderUp className="mr-1.5 h-4 w-4" /> Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-2">
          {stats.map(({ label, value, change, trend, progress, barColor }) => (
            <div key={label} className="space-y-1.5">
              <p className="text-2xl font-medium">{value}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                {trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {change}%
                </span>
              </div>
              <Progress value={progress} className={`h-1.5 ${barColor}`} />
            </div>
          ))}
        </div>

        <div className="flex items-center pt-2">
          <Input
            placeholder="Cari pelanggan..."
            value={(table.getColumn('customer')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('customer')?.setFilterValue(e.target.value)}
            className="max-w-sm rounded-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
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
      </CardContent>
    </Card>
  );
}
