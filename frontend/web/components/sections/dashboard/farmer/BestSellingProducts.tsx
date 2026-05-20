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
import { ArrowUpDown, FolderUp, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth';
import { useFarmerAnalytics } from '@/hooks/use-farmer-analytics';
import { Skeleton } from '@/components/ui/skeleton';

export type Product = {
  id: string;
  product: string;
  image: string;
  sold: number;
  sales: number;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'product',
    header: 'Produk',
    cell: ({ row }) => {
      const image = row.original.image || 'https://placehold.co/48x48?text=Product';
      const name = row.getValue('product') as string;
      const id = row.original.id;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={image}
            alt={name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-md object-cover border"
          />
          <div className="flex flex-col">
            <span
              className="font-medium text-sm truncate max-w-[150px] lg:max-w-[200px]"
              title={name}
            >
              {name}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase">
              {id.split('-')[0]}...
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'sold',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Terjual
        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {(row.getValue('sold') as number).toLocaleString('id-ID')} pcs
      </div>
    ),
  },
  {
    accessorKey: 'sales',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Pendapatan
        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(row.getValue('sales') as number);
      return <div className="text-right font-medium tabular-nums">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.id)}>
                Salin ID produk
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem>Lihat detail produk</DropdownMenuItem>
              <DropdownMenuItem>Edit produk</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTableDemo({ className }: { className?: string }) {
  const user = useAuthStore((s) => s.user);
  const { data: analytics, isLoading, error } = useFarmerAnalytics(user?.id);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const tableData = React.useMemo(() => {
    if (!analytics?.top_products) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (analytics.top_products as any[]).map((p) => ({
      id: p.id,
      product: p.title,
      image: p.image,
      sold: p.sold_count,
      sales: p.revenue,
    }));
  }, [analytics]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: tableData,
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

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="flex items-center pt-4">
            <Skeleton className="h-9 w-full max-w-sm" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={cn(
          'w-full h-64 flex items-center justify-center text-red-500 border-red-200 bg-red-50',
          className
        )}
      >
        Gagal memuat data produk terlaris
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Produk Terlaris</CardTitle>
          <Button>
            <FolderUp className="mr-1.5 h-4 w-4" /> Export
          </Button>
        </div>
        <div className="flex items-center pt-4">
          <Input
            placeholder="Cari produk..."
            value={(table.getColumn('product')?.getFilterValue() as string) ?? ''}
            onChange={(e) => table.getColumn('product')?.setFilterValue(e.target.value)}
            className="rounded-sm max-w-sm"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
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
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Tidak ada hasil.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} produk ditemukan
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
