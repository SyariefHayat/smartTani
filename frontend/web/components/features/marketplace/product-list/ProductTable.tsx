'use client';

import { flexRender, Table as ReactTable } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Package } from 'lucide-react';
import { Product } from './types';

interface ProductTableProps {
  table: ReactTable<Product>;
  columnsCount: number;
}

export function ProductTable({ table, columnsCount }: ProductTableProps) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const pageSize = table.getState().pagination.pageSize;
  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toRow = Math.min(currentPage * pageSize, totalRows);

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-slate-200">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'px-3 sm:px-4 font-semibold text-slate-600 h-11 text-xs uppercase tracking-wide whitespace-nowrap',
                      header.id === 'sku' && 'hidden xl:table-cell',
                      header.id === 'rating' && 'hidden lg:table-cell',
                      header.id === 'category' && 'hidden md:table-cell',
                      header.id === 'stock' && 'hidden sm:table-cell',
                      header.id === 'status' && 'hidden sm:table-cell',
                      header.id === 'select' && 'w-10 sm:w-12',
                      header.id === 'actions' && 'w-10 sm:w-12'
                    )}
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
              table.getRowModel().rows.map((row, i) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cn(
                    'group border-slate-100 transition-colors hover:bg-green-50/40',
                    i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'px-3 sm:px-4 py-3',
                        cell.column.id === 'sku' && 'hidden xl:table-cell',
                        cell.column.id === 'rating' && 'hidden lg:table-cell',
                        cell.column.id === 'category' && 'hidden md:table-cell',
                        cell.column.id === 'stock' && 'hidden sm:table-cell',
                        cell.column.id === 'status' && 'hidden sm:table-cell'
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columnsCount} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                    <Package className="mb-2 h-12 w-12 opacity-20" />
                    <p className="font-medium text-slate-500">Produk tidak ditemukan</p>
                    <p className="text-xs text-slate-400">Coba ubah kata kunci atau hapus filter</p>
                    <Button
                      variant="link"
                      className="mt-1 h-auto p-0 text-xs text-green-600"
                      onClick={() => table.resetColumnFilters()}
                    >
                      Reset Semua Filter
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Menampilkan{' '}
          <span className="font-semibold text-slate-800">
            {fromRow}–{toRow}
          </span>{' '}
          dari <span className="font-semibold text-slate-800">{totalRows}</span> produk
        </p>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-200 px-3 text-slate-600 text-xs"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            «
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-200 px-3 text-slate-600 text-xs"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Sebelumnya
          </Button>

          {/* Page number indicators */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <Button
                  key={page}
                  size="sm"
                  variant={isActive ? 'default' : 'outline'}
                  className={cn(
                    'h-8 w-8 p-0 text-xs',
                    isActive
                      ? 'bg-green-600 border-green-600 text-white hover:bg-green-700'
                      : 'border-slate-200 text-slate-600'
                  )}
                  onClick={() => table.setPageIndex(page - 1)}
                >
                  {page}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-200 px-3 text-slate-600 text-xs"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Berikutnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-200 px-3 text-slate-600 text-xs"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            »
          </Button>
        </div>
      </div>
    </Card>
  );
}
