'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Table } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderFiltersProps<TData> {
  table: Table<TData>;
}

export function OrderFilters<TData>({ table }: OrderFiltersProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between w-full pb-1">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Cari ID pesanan atau pelanggan..."
            value={(table.getColumn('customerName')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('customerName')?.setFilterValue(event.target.value)
            }
            className="pl-9 !h-10 border-slate-200 bg-white text-slate-900 text-sm"
          />
        </div>
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => table.resetColumnFilters()}
            className="!h-10 px-3 cursor-pointer text-slate-700 bg-white text-sm"
          >
            Reset
            <X className="ml-1.5 h-4 w-4 shrink-0 text-slate-400" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className="w-[180px] !h-10 border-slate-200 bg-white cursor-pointer text-slate-900 text-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white text-slate-900">
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="paid">Perlu Konfirmasi</SelectItem>
            <SelectItem value="confirmed_seller">Dikonfirmasi</SelectItem>
            <SelectItem value="shipped">Dikirim</SelectItem>
            <SelectItem value="delivered">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
