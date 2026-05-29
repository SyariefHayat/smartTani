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
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionFilters } from './TransactionFilters';

interface TransactionTableProps<TData> {
  table: ReactTable<TData>;
  columnsCount: number;
  totalTransactions?: number;
}

export function TransactionTable<TData>({
  table,
  columnsCount,
  totalTransactions = 0,
}: TransactionTableProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const fromRow = totalTransactions === 0 ? 0 : pageIndex * pageSize + 1;
  const toRow = Math.min((pageIndex + 1) * pageSize, totalTransactions);

  return (
    <Card className="w-full border border-slate-200 bg-white">
      <CardContent className="space-y-3 pt-4">
        {/* Filters integrated inside the container card */}
        <TransactionFilters table={table} />

        <div className="rounded-md border bg-white overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
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
                    Tidak ada data transaksi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Custom Pagination */}
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
              className="cursor-pointer text-slate-700 bg-white border-slate-200 text-xs font-semibold hover:bg-slate-50 h-8 flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer text-slate-700 bg-white border-slate-200 text-xs font-semibold hover:bg-slate-50 h-8 flex items-center gap-1"
            >
              Berikutnya
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
