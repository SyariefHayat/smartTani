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
import { StockTable } from './StockTable';
import { columns } from './columns';
import { ProductStock, StockStatus, StockTableActions } from './types';
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
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';
import { toast } from 'sonner';

export function FarmerStockManagement() {
  const user = useAuthStore((s) => s.user);
  const {
    data: response,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFarmerProducts(user?.id, { limit: 100 });
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

  const isOffline = !!error;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Layanan persediaan sedang offline. Menggunakan data demo lokal.');
    }
  }, [isOffline]);

  const mockStocks = React.useMemo<ProductStock[]>(
    () => [
      {
        id: 'mock-stock-1',
        name: 'Pupuk Organik Cair',
        sku: 'PPK-OC01',
        category: 'Pupuk',
        quantity: 45,
        unit: 'botol',
        warehouse: 'Surabaya',
        minStock: 10,
        lastUpdated: new Date().toISOString(),
        status: 'In Stock' as StockStatus,
        pricePerUnit: 45000,
      },
      {
        id: 'mock-stock-2',
        name: 'Benih Padi Pandanwangi 5kg',
        sku: 'BNH-PW02',
        category: 'Benih',
        quantity: 4,
        unit: 'karung',
        warehouse: 'Lamongan',
        minStock: 15,
        lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Low Stock' as StockStatus,
        pricePerUnit: 120000,
      },
      {
        id: 'mock-stock-3',
        name: 'Pestisida Hama Wereng 1L',
        sku: 'PST-WR03',
        category: 'Pestisida',
        quantity: 0,
        unit: 'botol',
        warehouse: 'Malang',
        minStock: 5,
        lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Out of Stock' as StockStatus,
        pricePerUnit: 85000,
      },
    ],
    []
  );

  const stocks: ProductStock[] = React.useMemo(() => {
    if (isOffline || !response?.data?.products || response.data.products.length === 0) {
      return mockStocks;
    }
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
        warehouse: p.location?.city || 'Gudang Utama',
        minStock,
        lastUpdated: p.updatedAt,
        status,
        pricePerUnit: p.price_per_unit,
      };
    });
  }, [response, isOffline, mockStocks]);

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
    if (isNaN(value) || value < 0) {
      toast.error('Jumlah tidak valid');
      return;
    }

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
          toast.success(
            isUpdateStockOpen
              ? 'Jumlah stok berhasil diperbarui'
              : 'Batas minimal stok berhasil diperbarui'
          );
          refetch();
        },
        onError: () => {
          toast.error('Gagal memperbarui data stok');
        },
      }
    );
  };

  // Export handler
  const handleExport = React.useCallback(() => {
    if (stocks.length === 0) {
      toast.error('Tidak ada data stok untuk diekspor');
      return;
    }

    const statusLabels: Record<string, string> = {
      'In Stock': 'Tersedia',
      'Low Stock': 'Menipis',
      'Out of Stock': 'Habis',
    };

    exportToCSV({
      data: stocks,
      columns: [
        { header: 'ID Produk', accessor: (row) => row.id },
        { header: 'SKU', accessor: (row) => row.sku },
        { header: 'Nama Produk', accessor: (row) => row.name },
        { header: 'Kategori', accessor: (row) => row.category },
        { header: 'Jumlah Stok', accessor: (row) => row.quantity },
        { header: 'Satuan', accessor: (row) => row.unit },
        { header: 'Minimal Stok', accessor: (row) => row.minStock },
        { header: 'Lokasi Gudang', accessor: (row) => row.warehouse },
        { header: 'Status Stok', accessor: (row) => statusLabels[row.status] || row.status },
      ],
      filename: 'daftar_stok_produk',
    });
    toast.success('Data persediaan berhasil diekspor');
  }, [stocks]);

  // Actions meta callbacks passed to react-table options
  const tableActions: StockTableActions = React.useMemo(
    () => ({
      onUpdateStock: handleUpdateStock,
      onSetMinStock: handleSetMinStock,
    }),
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: stocks,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    meta: tableActions,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  React.useEffect(() => {
    table.setPageIndex(0);
  }, [columnFilters]);

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <StockHeader onExport={handleExport} />

        {isOffline && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
              <p>
                Layanan Persediaan Offline: Gagal memuat data teraktual. Menggunakan data demo
                lokal.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              {isRefetching ? 'Menghubungkan...' : 'Coba Hubungkan Kembali'}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="w-full text-slate-900 space-y-6">
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-[450px] w-full rounded-xl" />
          </div>
        ) : (
          <>
            <StockStats stocks={stocks} />
            <StockTable table={table} columnsCount={columns.length} isLoading={isLoading} />
          </>
        )}
      </div>

      {/* Update Modals */}
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {isUpdateStockOpen ? 'Update Stok Persediaan' : 'Set Batas Minimal Stok'}
            </DialogTitle>
            <DialogDescription className="text-slate-500 mt-1">
              Produk: <strong>{selectedProduct?.name}</strong> ({selectedProduct?.sku})
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="value" className="text-sm font-semibold text-slate-700">
                {isUpdateStockOpen ? 'Jumlah Stok Baru' : 'Batas Minimal Stok Baru'}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="value"
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="text-slate-900 font-semibold"
                />
                <span className="text-sm font-medium text-slate-500">{selectedProduct?.unit}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setIsUpdateStockOpen(false);
                setIsSetMinStockOpen(false);
                setSelectedProduct(null);
              }}
              className="cursor-pointer"
            >
              Batal
            </Button>
            <Button
              onClick={onConfirmUpdate}
              disabled={updateMutation.isPending}
              className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white"
            >
              {updateMutation.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
