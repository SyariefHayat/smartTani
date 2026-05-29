'use client';

import * as React from 'react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Columns, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FinanceTableProps<TData> {
  table: ReactTable<TData>;
  columnsCount: number;
  totalTransactions?: number;
}

const COLUMN_LABELS: Record<string, string> = {
  date: 'Tanggal',
  description: 'Keterangan',
  type: 'Tipe',
  amount: 'Jumlah',
  status: 'Status',
};

export function FinanceTable<TData>({
  table,
  columnsCount,
  totalTransactions = 0,
}: FinanceTableProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const { pageIndex, pageSize } = table.getState().pagination;
  const fromRow = totalTransactions === 0 ? 0 : pageIndex * pageSize + 1;
  const toRow = Math.min((pageIndex + 1) * pageSize, totalTransactions);

  return (
    <Card className="w-full border border-slate-200 bg-white">
      <CardContent className="space-y-3 pt-4">
        {/* Table Filters & Toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center justify-between w-full pb-1">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            {/* Search Description */}
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Cari keterangan transaksi..."
                className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900"
                value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn('description')?.setFilterValue(event.target.value)
                }
              />
            </div>
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-9 px-2 lg:px-3 text-slate-500 hover:text-slate-900 cursor-pointer text-sm shrink-0"
              >
                Reset
                <X className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          {/* Columns Visibility Toggle */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-md text-xs shrink-0"
                >
                  <Columns className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                  Kolom
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="cursor-pointer text-xs"
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

        {/* Table Render */}
        <div className="overflow-hidden rounded-md border bg-white">
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
                  <TableCell
                    colSpan={columnsCount}
                    className="h-24 text-center text-muted-foreground text-sm font-medium"
                  >
                    Tidak ada riwayat transaksi keuangan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Table Pagination Controls */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="text-xs text-muted-foreground">
            {totalTransactions === 0 ? (
              '0 transaksi ditemukan'
            ) : (
              <>
                Menampilkan{' '}
                <span className="font-semibold text-slate-900">
                  {fromRow}–{toRow}
                </span>{' '}
                dari <span className="font-semibold text-slate-900">{totalTransactions}</span>{' '}
                transaksi
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer text-slate-700 bg-white border-slate-200 text-xs font-semibold hover:bg-slate-50 h-8"
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer text-slate-700 bg-white border-slate-200 text-xs font-semibold hover:bg-slate-50 h-8"
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
