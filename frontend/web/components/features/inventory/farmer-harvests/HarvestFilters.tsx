'use client';

import { Table } from '@tanstack/react-table';
import { Check, Columns, Plus, Search, X } from 'lucide-react';
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

interface HarvestFiltersProps<TData> {
  table: Table<TData>;
}

const QUALITY_LABELS: Record<string, string> = {
  A: 'Grade A',
  B: 'Grade B',
  C: 'Grade C',
};

const COLUMN_LABELS: Record<string, string> = {
  id: 'ID Panen',
  landName: 'Lahan & Komoditas',
  harvest_date: 'Tanggal Panen',
  quantity: 'Hasil Panen',
  quality_grade: 'Kualitas',
};

export function HarvestFilters<TData>({ table }: HarvestFiltersProps<TData>) {
  const currentQualityFilter = (table.getColumn('quality_grade')?.getFilterValue() as string) ?? '';
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between w-full pb-1">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-2xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Cari lahan atau komoditas..."
            className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900"
            value={(table.getColumn('landName')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('landName')?.setFilterValue(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Quality Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 flex-1 sm:flex-none cursor-pointer rounded-md text-sm',
                  currentQualityFilter &&
                    'border-green-300 bg-green-50/50 text-green-700 hover:text-green-800 hover:bg-green-50'
                )}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Kualitas</span>
                {currentQualityFilter && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 rounded-sm px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-transparent hover:bg-green-100"
                  >
                    {QUALITY_LABELS[currentQualityFilter] ?? currentQualityFilter}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter Kualitas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['A', 'B', 'C'] as const).map((grade) => (
                  <DropdownMenuItem
                    key={grade}
                    className="flex items-center justify-between cursor-pointer text-sm"
                    onClick={() => table.getColumn('quality_grade')?.setFilterValue(grade)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          grade === 'A' && 'bg-emerald-500',
                          grade === 'B' && 'bg-blue-500',
                          grade === 'C' && 'bg-amber-500'
                        )}
                      />
                      {QUALITY_LABELS[grade]}
                    </div>
                    {currentQualityFilter === grade && (
                      <Check className="h-4 w-4 text-emerald-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {currentQualityFilter && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-center font-medium text-destructive cursor-pointer text-sm focus:text-destructive"
                    onClick={() => table.getColumn('quality_grade')?.setFilterValue(undefined)}
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
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 lg:px-3 text-slate-500 hover:text-slate-900 cursor-pointer text-sm"
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
              className="h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 cursor-pointer rounded-md text-sm"
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
                    className="cursor-pointer text-sm"
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
