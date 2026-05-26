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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/stores/auth';
import { marketplaceService } from '@/services/marketplace';
import { exportToCSV } from '@/lib/export-csv';
import { ProductStats } from './product-list/ProductStats';
import { ProductHeader } from './product-list/ProductHeader';
import { ProductTable } from './product-list/ProductTable';
import { columns } from './product-list/columns';
import { Product as UIProduct, ProductTableActions } from './product-list/types';
import { ProductForm } from './ProductForm';
import { ProductDetailDialog } from './ProductDetailDialog';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function FarmerProductList() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const router = useRouter();

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

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<UIProduct | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [detailProduct, setDetailProduct] = React.useState<UIProduct | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [deleteProduct, setDeleteProduct] = React.useState<UIProduct | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Fetch products
  const { data, isLoading, isError, error, refetch } = useQuery({
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

  // Fetch categories for the edit form
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => marketplaceService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch full product details for edit/detail (needs the API Product, not the UI product)
  const { data: fullProductData } = useQuery({
    queryKey: ['product-detail', editProduct?.id || detailProduct?.id],
    queryFn: () => {
      const productId = editProduct?.id || detailProduct?.id;
      if (!productId) throw new Error('No product ID');
      return marketplaceService.getProductById(productId);
    },
    enabled: !!(editProduct?.id || detailProduct?.id),
  });

  // Deactivate product mutation
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => marketplaceService.deactivateProduct(id),
    onSuccess: () => {
      toast.success('Produk berhasil dinonaktifkan');
      queryClient.invalidateQueries({ queryKey: ['farmer-products'] });
      refetch(); // Force refetch the products list immediately to update UI status
      setDeleteDialogOpen(false);
      setDeleteProduct(null);
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      toast.error(err.response?.data?.message || 'Gagal menonaktifkan produk');
    },
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(
        'Gagal mengambil data produk: ' +
          (error instanceof Error ? error.message : 'Terjadi kesalahan')
      );
    }
  }, [isError, error]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const detailId = params.get('detail');
      const editId = params.get('edit');

      const loadProductForAction = async (id: string, action: 'detail' | 'edit') => {
        try {
          const res = await marketplaceService.getProductById(id);
          if (res?.data) {
            const p = res.data;
            const uiProduct: UIProduct = {
              id: p._id,
              name: p.title,
              sku: p._id.slice(-6).toUpperCase(),
              category: p.category,
              price: p.price_per_unit,
              stock: p.stock,
              unit: p.unit,
              rating: 4.5,
              status:
                p.stock === 0
                  ? 'Out Of Stock'
                  : p.status === 'active'
                    ? 'Active'
                    : p.status === 'pending'
                      ? 'Draft'
                      : 'Nonaktif',
              image: p.images[0] || '/images/products/placeholder.jpg',
            };

            if (action === 'detail') {
              setDetailProduct(uiProduct);
              setDetailDialogOpen(true);
            } else {
              setEditProduct(uiProduct);
              setEditDialogOpen(true);
            }

            // Clean query parameters from URL silently
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        } catch (err) {
          console.error('Failed to load product details for dashboard query parameter action', err);
        }
      };

      if (detailId) {
        loadProductForAction(detailId, 'detail');
      } else if (editId) {
        loadProductForAction(editId, 'edit');
      }
    }
  }, []);

  const products: UIProduct[] = React.useMemo(() => {
    const rawProducts = data?.data?.products;
    if (!rawProducts) return [];

    return rawProducts.map((p) => ({
      id: p._id,
      name: p.title,
      sku: p._id.slice(-6).toUpperCase(),
      category: p.category,
      price: p.price_per_unit,
      stock: p.stock,
      unit: p.unit,
      rating: 4.5, // fallback as not in DB yet
      status:
        p.stock === 0
          ? 'Out Of Stock'
          : p.status === 'active'
            ? 'Active'
            : p.status === 'pending'
              ? 'Draft'
              : 'Nonaktif',
      image: p.images[0] || '/images/products/placeholder.jpg',
    }));
  }, [data]);

  // Table action handlers
  const tableActions: ProductTableActions = React.useMemo(
    () => ({
      onViewDetail: (product) => {
        setDetailProduct(product);
        setDetailDialogOpen(true);
      },
      onEdit: (product) => {
        setEditProduct(product);
        setEditDialogOpen(true);
      },
      onDelete: (product) => {
        setDeleteProduct(product);
        setDeleteDialogOpen(true);
      },
    }),
    []
  );

  // Export handler
  const handleExport = React.useCallback(() => {
    if (products.length === 0) {
      toast.error('Tidak ada data produk untuk di-export');
      return;
    }

    const statusLabels: Record<string, string> = {
      Active: 'Aktif',
      'Out Of Stock': 'Stok Habis',
      'Closed For Sale': 'Tutup Penjualan',
    };

    exportToCSV({
      data: products,
      columns: [
        { header: 'ID', accessor: (row) => row.id },
        { header: 'SKU', accessor: (row) => row.sku },
        { header: 'Nama Produk', accessor: (row) => row.name },
        { header: 'Kategori', accessor: (row) => row.category },
        { header: 'Harga', accessor: (row) => row.price },
        { header: 'Stok', accessor: (row) => row.stock },
        { header: 'Satuan', accessor: (row) => row.unit },
        { header: 'Status', accessor: (row) => statusLabels[row.status] || row.status },
      ],
      filename: 'daftar_produk',
    });
    toast.success('Data produk berhasil di-export');
  }, [products]);

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
    meta: tableActions,
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
        <ProductHeader
          onExport={handleExport}
          onAddProduct={() => router.push('/dashboard/farmer/products/new')}
        />
        {isError ? (
          <div className="flex w-full h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 text-red-500 p-6 text-center text-sm font-medium shadow-xs">
            <svg
              className="w-10 h-10 mb-3 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="font-semibold text-base mb-1">Gagal Memuat Daftar Produk</p>
            <p className="text-xs text-red-400">
              Layanan marketplace-service tidak merespon atau sedang tidak aktif. Harap hubungi
              administrator.
            </p>
          </div>
        ) : (
          <>
            <ProductStats products={products} />
            <ProductTable
              table={table}
              columnsCount={columns.length}
              totalRows={data?.data?.pagination?.total}
              isLoading={isLoading}
            />
          </>
        )}
      </div>

      {/* Create Product Dialog */}
      <ProductForm
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        categories={categoriesData?.data || []}
      />

      {/* Edit Product Dialog */}
      <ProductForm
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditProduct(null);
        }}
        product={fullProductData?.data}
        categories={categoriesData?.data || []}
      />

      {/* Detail Product Dialog */}
      <ProductDetailDialog
        open={detailDialogOpen}
        onOpenChange={(open) => {
          setDetailDialogOpen(open);
          if (!open) setDetailProduct(null);
        }}
        product={fullProductData?.data}
        onEdit={() => {
          setDetailDialogOpen(false);
          if (detailProduct) {
            setEditProduct(detailProduct);
            setEditDialogOpen(true);
          }
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nonaktifkan Produk</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menonaktifkan produk <strong>{deleteProduct?.name}</strong>?
              Produk tidak akan ditampilkan di marketplace setelah dinonaktifkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteProduct(null);
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={() => {
                if (deleteProduct) {
                  deactivateMutation.mutate(deleteProduct.id);
                }
              }}
              disabled={deactivateMutation.isPending}
            >
              {deactivateMutation.isPending ? 'Memproses...' : 'Nonaktifkan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
