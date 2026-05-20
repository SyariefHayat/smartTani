'use client';

import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PurchaseFiltersProps<TData> {
  table: Table<TData>;
}

export function PurchaseFilters<TData>({ table }: PurchaseFiltersProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama barang atau pemasok..."
            value={(table.getColumn('item_name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('item_name')?.setFilterValue(event.target.value)}
            className="pl-9 border-slate-200"
          />
        </div>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-9 px-2 lg:px-3 text-slate-500 hover:text-slate-900"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <p className="text-sm text-slate-500 font-medium mr-2">
          Total: <span className="text-slate-900">{table.getFilteredRowModel().rows.length}</span>{' '}
          Catatan
        </p>
      </div>
    </div>
  );
}
