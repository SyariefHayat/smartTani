'use client';

import { Table } from '@tanstack/react-table';
import { Check, Columns, Plus, Search, X, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import * as React from 'react';

interface TransactionFiltersProps<TData> {
  table: Table<TData>;
}

const TYPE_LABELS: Record<string, string> = {
  Income: 'Masuk',
  Expense: 'Keluar',
  Withdrawal: 'Tarik Saldo',
  TopUp: 'Top Up',
};

const STATUS_LABELS: Record<string, string> = {
  Completed: 'Berhasil',
  Pending: 'Proses',
  Failed: 'Gagal',
};

const COLUMN_LABELS: Record<string, string> = {
  date: 'Tanggal',
  description: 'Keterangan',
  type: 'Tipe',
  category: 'Kategori',
  amount: 'Nominal',
  status: 'Status',
};

export function TransactionFilters<TData>({ table }: TransactionFiltersProps<TData>) {
  const currentTypeFilter = (table.getColumn('type')?.getFilterValue() as string) ?? '';
  const currentStatusFilter = (table.getColumn('status')?.getFilterValue() as string) ?? '';
  const isFiltered = table.getState().columnFilters.length > 0;
  const [date, setDate] = React.useState<Date>();

  React.useEffect(() => {
    if (date) {
      table.getColumn('date')?.setFilterValue(format(date, 'yyyy-MM-dd'));
    } else {
      table.getColumn('date')?.setFilterValue(undefined);
    }
  }, [date, table]);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between w-full pb-1">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-3xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Cari keterangan atau referensi..."
            className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900"
            value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('description')?.setFilterValue(event.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 flex items-center cursor-pointer rounded-md text-sm',
                  date && 'border-green-300 bg-green-50/50 text-green-700 hover:text-green-800'
                )}
              >
                <CalendarIcon className="mr-1.5 h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate text-xs font-semibold">
                  {date ? format(date, 'dd MMM yyyy', { locale: id }) : 'Pilih Tanggal'}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>

          {/* Tipe Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 flex items-center cursor-pointer rounded-md text-sm',
                  currentTypeFilter &&
                    'border-green-300 bg-green-50/50 text-green-700 hover:text-green-800 hover:bg-green-50'
                )}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Tipe</span>
                {currentTypeFilter && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 rounded-sm px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-transparent hover:bg-green-100 animate-fade-in"
                  >
                    {TYPE_LABELS[currentTypeFilter] ?? currentTypeFilter}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Filter Tipe</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {(['Income', 'Expense', 'Withdrawal', 'TopUp'] as const).map((type) => (
                  <DropdownMenuItem
                    key={type}
                    className="flex items-center justify-between cursor-pointer text-sm"
                    onClick={() => table.getColumn('type')?.setFilterValue(type)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          type === 'Income' && 'bg-emerald-500',
                          type === 'Expense' && 'bg-rose-500',
                          type === 'Withdrawal' && 'bg-blue-500',
                          type === 'TopUp' && 'bg-purple-500'
                        )}
                      />
                      {TYPE_LABELS[type]}
                    </div>
                    {currentTypeFilter === type && <Check className="h-4 w-4 text-emerald-600" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {currentTypeFilter && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-center font-medium text-destructive cursor-pointer text-sm focus:text-destructive"
                    onClick={() => table.getColumn('type')?.setFilterValue(undefined)}
                  >
                    Hapus Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 flex items-center cursor-pointer rounded-md text-sm',
                  currentStatusFilter &&
                    'border-green-300 bg-green-50/50 text-green-700 hover:text-green-800 hover:bg-green-50'
                )}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Status</span>
                {currentStatusFilter && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 rounded-sm px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-transparent hover:bg-green-100 animate-fade-in"
                  >
                    {STATUS_LABELS[currentStatusFilter] ?? currentStatusFilter}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {(['Completed', 'Pending', 'Failed'] as const).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className="flex items-center justify-between cursor-pointer text-sm"
                    onClick={() => table.getColumn('status')?.setFilterValue(status)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          status === 'Completed' && 'bg-emerald-500',
                          status === 'Pending' && 'bg-amber-500',
                          status === 'Failed' && 'bg-rose-500'
                        )}
                      />
                      {STATUS_LABELS[status]}
                    </div>
                    {currentStatusFilter === status && (
                      <Check className="h-4 w-4 text-emerald-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {currentStatusFilter && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-center font-medium text-destructive cursor-pointer text-sm focus:text-destructive"
                    onClick={() => table.getColumn('status')?.setFilterValue(undefined)}
                  >
                    Hapus Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => {
                setDate(undefined);
                table.resetColumnFilters();
              }}
              className="h-9 px-2 lg:px-3 text-slate-500 hover:text-slate-900 cursor-pointer text-sm shrink-0"
            >
              Reset
              <X className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Columns Toggle */}
      <div className="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-md text-sm shrink-0 animate-fade-in"
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
  );
}
