'use client';

import { Table } from '@tanstack/react-table';
import { Check, Columns, Plus, Search } from 'lucide-react';
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

import { Product } from './types';

interface ProductFiltersProps {
  table: Table<Product>;
}

const STATUS_LABELS: Record<string, string> = {
  Active: 'Aktif',
  'Out Of Stock': 'Habis',
  'Closed For Sale': 'Tidak Dijual',
};

export function ProductFilters({ table }: ProductFiltersProps) {
  const currentStatusFilter = (table.getColumn('status')?.getFilterValue() as string) ?? '';
  const currentCategoryFilter = (table.getColumn('category')?.getFilterValue() as string) ?? '';

  return (
    <div className="flex flex-wrap items-center gap-2 pt-4">
      {/* Search */}
      <div className="relative w-full md:w-72">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <Input
          placeholder="Cari produk..."
          className="h-10 border-slate-200 bg-white pl-9 pr-4 text-sm"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'h-10 border-slate-200 bg-white text-slate-700 flex-1 sm:flex-none text-sm',
                currentStatusFilter && 'border-green-300 bg-green-50 text-green-800'
              )}
            >
              <Plus className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">Status</span>
              {currentStatusFilter && (
                <Badge
                  variant="secondary"
                  className="ml-2 rounded-sm px-1 font-normal bg-green-100 text-green-700"
                >
                  {STATUS_LABELS[currentStatusFilter] ?? currentStatusFilter}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-52">
            <DropdownMenuLabel>Filter berdasarkan Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {(['Active', 'Out Of Stock', 'Closed For Sale'] as const).map((status) => (
                <DropdownMenuItem
                  key={status}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => table.getColumn('status')?.setFilterValue(status)}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'h-2 w-2 rounded-full',
                        status === 'Active' && 'bg-green-500',
                        status === 'Out Of Stock' && 'bg-yellow-500',
                        status === 'Closed For Sale' && 'bg-red-400'
                      )}
                    />
                    {STATUS_LABELS[status]}
                  </div>
                  {currentStatusFilter === status && <Check className="h-4 w-4 text-green-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {currentStatusFilter && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-center font-medium text-destructive cursor-pointer"
                  onClick={() => table.getColumn('status')?.setFilterValue(undefined)}
                >
                  Hapus Filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Category Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'h-10 border-slate-200 bg-white text-slate-700 flex-1 sm:flex-none text-sm',
                currentCategoryFilter && 'border-green-300 bg-green-50 text-green-800'
              )}
            >
              <Plus className="mr-2 h-4 w-4 shrink-0" />
              <span className="truncate">Kategori</span>
              {currentCategoryFilter && (
                <Badge
                  variant="secondary"
                  className="ml-2 rounded-sm px-1 font-normal bg-green-100 text-green-700"
                >
                  {currentCategoryFilter}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Filter berdasarkan Kategori</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {['Pupuk', 'Benih', 'Electronics', 'Beauty'].map((category) => (
                <DropdownMenuItem
                  key={category}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => table.getColumn('category')?.setFilterValue(category)}
                >
                  {category}
                  {currentCategoryFilter === category && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            {currentCategoryFilter && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="justify-center text-center font-medium text-destructive cursor-pointer"
                  onClick={() => table.getColumn('category')?.setFilterValue(undefined)}
                >
                  Hapus Filter
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Columns Toggle */}
      <div className="ml-auto hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-10 border-slate-200 bg-white text-slate-700 text-sm"
            >
              Kolom
              <Columns className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Tampilkan Kolom</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
