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
import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';

import { Product } from './types';

interface ProductFiltersProps {
  table: Table<Product>;
}

const STATUS_LABELS: Record<string, string> = {
  Active: 'Aktif',
  'Out Of Stock': 'Habis',
  'Closed For Sale': 'Tidak Dijual',
};

const COLUMN_LABELS: Record<string, string> = {
  select: 'Pilih',
  name: 'Nama Produk',
  price: 'Harga',
  category: 'Kategori',
  stock: 'Stok',
  rating: 'Rating',
  status: 'Status',
  sku: 'SKU',
};

export function ProductFilters({ table }: ProductFiltersProps) {
  const currentStatusFilter = (table.getColumn('status')?.getFilterValue() as string) ?? '';
  const currentCategoryFilter = (table.getColumn('category')?.getFilterValue() as string) ?? '';

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => marketplaceService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  const categoryNames = (categoriesData?.data || []).map((c) => c.name);

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between w-full pb-1">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-2xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Cari produk..."
            className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-sm"
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 flex-1 sm:flex-none cursor-pointer rounded-md text-sm',
                  currentStatusFilter &&
                    'border-green-300 bg-green-50/50 text-green-700 hover:text-green-800 hover:bg-green-50'
                )}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Status</span>
                {currentStatusFilter && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 rounded-sm px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-transparent hover:bg-green-100"
                  >
                    {STATUS_LABELS[currentStatusFilter] ?? currentStatusFilter}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['Active', 'Out Of Stock', 'Closed For Sale'] as const).map((status) => (
                  <DropdownMenuItem
                    key={status}
                    className="flex items-center justify-between cursor-pointer text-sm"
                    onClick={() => table.getColumn('status')?.setFilterValue(status)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full',
                          status === 'Active' && 'bg-emerald-500',
                          status === 'Out Of Stock' && 'bg-amber-500',
                          status === 'Closed For Sale' && 'bg-rose-400'
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

          {/* Category Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  'h-9 border-slate-200 bg-white text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50 flex-1 sm:flex-none cursor-pointer rounded-md text-sm',
                  currentCategoryFilter &&
                    'border-green-300 bg-green-50/50 text-green-700 hover:text-green-800 hover:bg-green-50'
                )}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5 shrink-0" />
                <span className="truncate">Kategori</span>
                {currentCategoryFilter && (
                  <Badge
                    variant="secondary"
                    className="ml-1.5 rounded-sm px-1.5 py-0.5 text-xs font-semibold bg-green-100 text-green-700 border-transparent hover:bg-green-100"
                  >
                    {currentCategoryFilter}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Filter Kategori</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="max-h-60 overflow-y-auto overflow-x-hidden p-1">
                {categoryNames.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    className="flex items-center justify-between cursor-pointer text-sm"
                    onClick={() => table.getColumn('category')?.setFilterValue(category)}
                  >
                    <span className="truncate">{category}</span>
                    {currentCategoryFilter === category && (
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              {currentCategoryFilter && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="justify-center text-center font-medium text-destructive cursor-pointer text-sm focus:text-destructive"
                    onClick={() => table.getColumn('category')?.setFilterValue(undefined)}
                  >
                    Hapus Filter
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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
