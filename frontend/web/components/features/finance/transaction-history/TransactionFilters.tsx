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
import { Search, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import * as React from 'react';

interface TransactionFiltersProps<TData> {
  table: Table<TData>;
}

export function TransactionFilters<TData>({ table }: TransactionFiltersProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [date, setDate] = React.useState<Date>();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari keterangan atau referensi..."
            value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
            className="pl-8"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={`w-[180px] justify-start text-left font-normal ${!date && 'text-muted-foreground'}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'dd MMM yyyy', { locale: id }) : <span>Pilih Tanggal</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={(table.getColumn('type')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('type')?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="Income">Masuk</SelectItem>
            <SelectItem value="Expense">Keluar</SelectItem>
            <SelectItem value="Withdrawal">Tarik Saldo</SelectItem>
            <SelectItem value="TopUp">Top Up</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn('status')?.getFilterValue() as string) ?? 'all'}
          onValueChange={(value) =>
            table.getColumn('status')?.setFilterValue(value === 'all' ? '' : value)
          }
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="Completed">Berhasil</SelectItem>
            <SelectItem value="Pending">Proses</SelectItem>
            <SelectItem value="Failed">Gagal</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
