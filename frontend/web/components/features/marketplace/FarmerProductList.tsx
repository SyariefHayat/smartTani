'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/auth';
import { marketplaceService } from '@/services/marketplace';
import { ProductStats } from './product-list/ProductStats';
import { ProductHeader } from './product-list/ProductHeader';
import { ProductFilters } from './product-list/ProductFilters';
import { ProductTable } from './product-list/ProductTable';
import { columns } from './product-list/columns';
import { Product as UIProduct } from './product-list/types';

export function FarmerProductList() {
  const user = useAuthStore((s) => s.user);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    sku: false,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'farmer-products',
      user?.id,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      columnFilters,
    ],
    queryFn: async () => {
      if (!user?.id) return null;

      const search = columnFilters.find((f) => f.id === 'name')?.value as string;
      const category = columnFilters.find((f) => f.id === 'category')?.value as string;

      return marketplaceService.getProducts({
        farmer_id: user.id,
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search,
        category: category,
      });
    },
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(
        'Gagal mengambil data produk: ' +
          (error instanceof Error ? error.message : 'Terjadi kesalahan')
      );
    }
  }, [isError, error]);

  const products: UIProduct[] = React.useMemo(() => {
    if (!data?.data?.products) return [];

    return data.data.products.map((p) => ({
      id: p._id,
      name: p.title,
      sku: p._id.slice(-6).toUpperCase(),
      category: p.category,
      price: p.price_per_unit,
      stock: p.stock,
      unit: p.unit,
      rating: 4.5, // fallback as not in DB yet
      status: p.stock === 0 ? 'Out Of Stock' : p.status === 'active' ? 'Active' : 'Closed For Sale',
      image: p.images[0] || '/images/products/placeholder.jpg',
    }));
  }, [data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: products,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: data?.data?.pagination?.pages ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <ProductHeader />
        <ProductStats products={products} />
        <ProductFilters table={table} />
        {isLoading ? (
          <div className="flex h-64 w-full items-center justify-center rounded-lg border border-dashed border-slate-200">
            <span className="text-sm text-slate-500 animate-pulse">Memuat data produk...</span>
          </div>
        ) : (
          <ProductTable
            table={table}
            columnsCount={columns.length}
            totalRows={data?.data?.pagination?.total}
          />
        )}
      </div>
    </div>
  );
}
