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
import { Skeleton } from '@/components/ui/skeleton';
import { SalesHistoryFilters } from './SalesHistoryFilters';
import { DateRange } from 'react-day-picker';
import { ShoppingBag } from 'lucide-react';

interface SalesHistoryTableProps<TData> {
  table: ReactTable<TData>;
  columnsCount: number;
  isLoading?: boolean;
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}

export function SalesHistoryTable<TData>({
  table,
  columnsCount,
  isLoading,
  dateRange,
  setDateRange,
}: SalesHistoryTableProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <Card className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <CardContent className="space-y-4 pt-4">
        {/* Integrated Filter and Search inside CardContent */}
        <SalesHistoryFilters table={table} dateRange={dateRange} setDateRange={setDateRange} />

        {/* Table itself */}
        <div className="rounded-lg border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-slate-100 hover:bg-transparent">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-semibold text-slate-600">
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
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx} className="border-slate-50 hover:bg-transparent">
                    {Array.from({ length: columnsCount }).map((_, colIdx) => (
                      <TableCell key={colIdx} className="py-4">
                        <Skeleton className="h-5 w-full bg-slate-100 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="border-slate-55 transition-colors hover:bg-slate-50/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columnsCount} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <ShoppingBag className="mb-2 h-12 w-12 opacity-20" />
                      <p className="font-medium text-slate-500">
                        Tidak ada riwayat penjualan ditemukan
                      </p>
                      <p className="text-xs text-slate-400">
                        Coba sesuaikan kata kunci pencarian atau ubah filter status
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            {isLoading ? (
              <Skeleton className="h-4 w-48 bg-slate-100" />
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
