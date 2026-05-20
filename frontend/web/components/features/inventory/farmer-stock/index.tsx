'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

import { StockHeader } from './StockHeader';
import { StockStats } from './StockStats';
import { StockFilters } from './StockFilters';
import { StockTable } from './StockTable';
import { columns } from './columns';
import { ProductStock, StockStatus } from './types';
import { useAuthStore } from '@/stores/auth';
import { useFarmerProducts, useUpdateProduct } from '@/hooks/use-farmer-products';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function FarmerStockManagement() {
  const user = useAuthStore((s) => s.user);
  const { data: response, isLoading, error } = useFarmerProducts(user?.id, { limit: 100 });
  const updateMutation = useUpdateProduct();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Modal State
  const [selectedProduct, setSelectedProduct] = React.useState<ProductStock | null>(null);
  const [isUpdateStockOpen, setIsUpdateStockOpen] = React.useState(false);
  const [isSetMinStockOpen, setIsSetMinStockOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');

  const stocks: ProductStock[] = React.useMemo(() => {
    if (!response?.data?.products) return [];
    return response.data.products.map((p) => {
      const quantity = p.stock || 0;
      const minStock = p.min_stock || 10;
      let status: StockStatus = 'In Stock';
      if (quantity === 0) status = 'Out of Stock';
      else if (quantity <= minStock) status = 'Low Stock';

      return {
        id: p._id,
        name: p.title,
        sku: p._id.substring(0, 8).toUpperCase(),
        category: p.category,
        quantity,
        unit: p.unit,
        warehouse: p.location.city,
        minStock,
        lastUpdated: p.updatedAt,
        status,
        pricePerUnit: p.price_per_unit,
      };
    });
  }, [response]);

  const handleUpdateStock = (product: ProductStock) => {
    setSelectedProduct(product);
    setInputValue(product.quantity.toString());
    setIsUpdateStockOpen(true);
  };

  const handleSetMinStock = (product: ProductStock) => {
    setSelectedProduct(product);
    setInputValue(product.minStock.toString());
    setIsSetMinStockOpen(true);
  };

  const onConfirmUpdate = async () => {
    if (!selectedProduct) return;
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const data = isUpdateStockOpen ? { stock: value } : { min_stock: value };

    updateMutation.mutate(
      {
        id: selectedProduct.id,
        data,
      },
      {
        onSuccess: () => {
          setIsUpdateStockOpen(false);
          setIsSetMinStockOpen(false);
          setSelectedProduct(null);
        },
      }
    );
  };

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: stocks,
    columns: columns.map((col) => {
      if (col.id === 'actions') {
        return {
          ...col,
          cell: (cellProps: unknown) => {
            // Re-define action cell to pass handlers
            const OriginalCell = col.cell as React.ComponentType<Record<string, unknown>>;
            return (
              <OriginalCell
                {...(cellProps as Record<string, unknown>)}
                onUpdateStock={handleUpdateStock}
                onSetMinStock={handleSetMinStock}
              />
            );
          },
        };
      }
      return col;
    }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500">
        <p className="font-medium">Gagal memuat data inventori</p>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <StockHeader />
        <StockStats stocks={stocks} />
        <div className="space-y-4">
          <StockFilters table={table} />
          <StockTable table={table} columnsCount={columns.length} />
        </div>
      </div>

      {/* Modals */}
      <Dialog
        open={isUpdateStockOpen || isSetMinStockOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsUpdateStockOpen(false);
            setIsSetMinStockOpen(false);
            setSelectedProduct(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isUpdateStockOpen ? 'Update Stok' : 'Set Minimal Stok'}</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name} ({selectedProduct?.sku})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="value">
                {isUpdateStockOpen ? 'Jumlah Stok Baru' : 'Minimal Stok Baru'}
              </Label>
              <Input
                id="value"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateStockOpen(false);
                setIsSetMinStockOpen(false);
                setSelectedProduct(null);
              }}
            >
              Batal
            </Button>
            <Button onClick={onConfirmUpdate} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
