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
import { WarehouseFilters } from './WarehouseFilters';

interface WarehouseTableProps<TData> {
  table: ReactTable<TData>;
  columnsCount: number;
  isLoading?: boolean;
}

export function WarehouseTable<TData>({
  table,
  columnsCount,
  isLoading,
}: WarehouseTableProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;
  const fromRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const toRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <Card className="w-full">
      <CardContent className="space-y-3">
        {/* Filters integrated inside the container card */}
        <WarehouseFilters table={table} />

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
              {isLoading ? (
                // In-table skeletons matching standard style
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: columnsCount }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-5 w-full animate-pulse bg-slate-100 rounded" />
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
                    colSpan={columnsCount}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Tidak ada data gudang.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-48 animate-pulse bg-slate-100 rounded inline-block" />
            ) : totalRows === 0 ? (
              '0 gudang ditemukan'
            ) : (
              <>
                Menampilkan{' '}
                <span className="font-semibold text-slate-900">
                  {fromRow}–{toRow}
                </span>{' '}
                dari <span className="font-semibold text-slate-900">{totalRows}</span> gudang
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
