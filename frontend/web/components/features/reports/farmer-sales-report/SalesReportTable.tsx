'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { flexRender, Table as ReactTable } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Columns, X, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SalesReportTableProps<TData> {
  table: ReactTable<TData>;
  columnsCount: number;
}

const COLUMN_LABELS: Record<string, string> = {
  date: 'Tanggal',
  id: 'ID Pesanan',
  customerName: 'Pelanggan',
  productName: 'Produk',
  total: 'Total',
  status: 'Status',
};

export function SalesReportTable<TData>({ table, columnsCount }: SalesReportTableProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Rincian Transaksi
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Daftar lengkap transaksi penjualan produk berdasarkan filter dan rentang tanggal.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Table Filters Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between w-full">
          <div className="flex flex-1 items-center gap-2 max-w-md">
            {/* Search Pelanggan */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Cari nama pelanggan..."
                className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900 focus-visible:ring-emerald-500"
                value={(table.getColumn('customerName')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('customerName')?.setFilterValue(event.target.value)
                }
              />
            </div>
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-9 px-2 text-slate-500 hover:text-slate-950 cursor-pointer text-sm font-semibold shrink-0"
              >
                Reset
                <X className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Columns Toggle */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-slate-200 bg-white text-slate-600 font-semibold hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-md text-sm shrink-0"
                >
                  <Columns className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                  Kolom
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="font-semibold text-slate-800 text-xs">
                  Tampilkan Kolom
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="cursor-pointer text-sm"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {COLUMN_LABELS[column.id] || column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Data Grid Table */}
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <Table>
            <TableHeader className="bg-slate-50/75 border-b border-slate-200">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider"
                    >
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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3.5 text-slate-700">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columnsCount}
                    className="h-32 text-center text-slate-400 font-medium text-sm"
                  >
                    Tidak ada data rincian transaksi penjualan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="text-sm font-medium text-slate-500">
            Menampilkan{' '}
            <span className="font-semibold text-slate-800">
              {table.getRowModel().rows?.length || 0}
            </span>{' '}
            dari <span className="font-semibold text-slate-800">{totalRows}</span> transaksi
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-xs h-8"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-xs h-8"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
