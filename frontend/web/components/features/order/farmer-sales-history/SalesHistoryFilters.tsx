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
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SalesHistoryFiltersProps<TData> {
  table: Table<TData>;
  dateRange: DateRange | undefined;
  setDateRange: (date: DateRange | undefined) => void;
}

export function SalesHistoryFilters<TData>({
  table,
  dateRange,
  setDateRange,
}: SalesHistoryFiltersProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || !!dateRange?.from;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between w-full pb-1">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Cari pelanggan..."
            value={(table.getColumn('customerName')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('customerName')?.setFilterValue(event.target.value)
            }
            className="pl-9 !h-10 border-slate-200 bg-white text-slate-900 text-sm"
          />
        </div>

        {/* Date Picker Range */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full sm:w-[260px] justify-start text-left font-normal bg-white border-slate-200 hover:bg-slate-50 hover:text-slate-900 !h-10 text-slate-900 text-sm cursor-pointer',
                !dateRange && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4 text-slate-500 shrink-0" />
              <span className="truncate">
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'dd LLL yyyy', { locale: id })} -{' '}
                      {format(dateRange.to, 'dd LLL yyyy', { locale: id })}
                    </>
                  ) : (
                    format(dateRange.from, 'dd LLL yyyy', { locale: id })
                  )
                ) : (
                  'Pilih Rentang Tanggal'
                )}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-white" align="start">
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              locale={id}
            />
          </PopoverContent>
        </Popover>

        {/* Reset Filter Button */}
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => {
              table.resetColumnFilters();
              setDateRange(undefined);
            }}
            className="!h-10 px-3 cursor-pointer text-slate-700 bg-white text-sm"
          >
            Reset
            <X className="ml-1.5 h-4 w-4 shrink-0 text-slate-400" />
          </Button>
        )}
      </div>

      {/* Status Filter */}
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
            <SelectItem value="delivered">Selesai</SelectItem>
            <SelectItem value="cancelled">Dibatalkan</SelectItem>
            <SelectItem value="refunded">Direfund</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
