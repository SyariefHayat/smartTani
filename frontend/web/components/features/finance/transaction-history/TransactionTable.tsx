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
}

export function TransactionTable<TData>({ table, columnsCount }: TransactionTableProps<TData>) {
  const displayedCount = table.getRowModel().rows.length;
  const filteredCount = table.getFilteredRowModel().rows.length;

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
          <div className="text-xs font-semibold text-slate-500">
            Menampilkan {displayedCount} dari {filteredCount} transaksi.
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="cursor-pointer text-xs font-semibold flex items-center gap-1.5"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="cursor-pointer text-xs font-semibold flex items-center gap-1.5"
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
