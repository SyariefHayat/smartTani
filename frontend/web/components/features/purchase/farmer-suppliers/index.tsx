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

import { SupplierHeader } from './SupplierHeader';
import { SupplierStats } from './SupplierStats';
import { SupplierTable } from './SupplierTable';
import { columns } from './columns';
import { Supplier, SupplierTableActions } from './types';
import { exportToCSV } from '@/lib/export-csv';
import { toast } from 'sonner';
import { SupplierForm } from './SupplierForm';
import { SupplierDetailDialog } from './SupplierDetailDialog';
import { useQuery } from '@tanstack/react-query';
import { marketplaceService } from '@/services/marketplace';
import { purchaseService } from '@/services/purchase';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Distributor Pupuk Nasional',
    category: 'Pupuk',
    contactPerson: 'Agus Setiawan',
    phone: '081234567890',
    email: 'agus@distributorpupuk.com',
    location: 'Surabaya, Jawa Timur',
    totalOrders: 15,
    lastOrderDate: '2024-05-01T10:00:00Z',
    status: 'active',
  },
  {
    id: 'SUP-002',
    name: 'Toko Tani Makmur',
    category: 'Benih',
    contactPerson: 'Siti Rohmah',
    phone: '082123456789',
    email: 'siti@tanimakmur.com',
    location: 'Malang, Jawa Timur',
    totalOrders: 8,
    lastOrderDate: '2024-04-28T14:30:00Z',
    status: 'active',
  },
  {
    id: 'SUP-003',
    name: 'Grosir Pestisida Jaya',
    category: 'Pestisida',
    contactPerson: 'Hendro Wijaya',
    phone: '081333444555',
    email: 'hendro@pestisidajaya.com',
    location: 'Sidoarjo, Jawa Timur',
    totalOrders: 20,
    lastOrderDate: '2024-04-25T09:15:00Z',
    status: 'active',
  },
  {
    id: 'SUP-004',
    name: 'Mitra Bibit Unggul',
    category: 'Benih',
    contactPerson: 'Dewi Lestari',
    phone: '085566778899',
    email: 'dewi@mitrabibit.com',
    location: 'Banyuwangi, Jawa Timur',
    totalOrders: 5,
    lastOrderDate: '2024-04-15T16:20:00Z',
    status: 'active',
  },
  {
    id: 'SUP-005',
    name: 'Teknologi Tani Mandiri',
    category: 'Alat Pertanian',
    contactPerson: 'Bambang Kusuma',
    phone: '081999000111',
    email: 'bambang@tektani.com',
    location: 'Semarang, Jawa Tengah',
    totalOrders: 3,
    lastOrderDate: '2024-03-20T11:45:00Z',
    status: 'inactive',
  },
];

export function FarmerSupplierList() {
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Fetch dynamic categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => marketplaceService.getCategories(),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch purchases directly from database via API
  const {
    data: purchases = [],
    isLoading: isLoadingPurchases,
    error: errorPurchases,
    refetch: refetchPurchases,
    isRefetching: isRefetchingPurchases,
  } = useQuery({
    queryKey: ['farmer-purchases-for-suppliers'],
    queryFn: () => purchaseService.getPurchases(),
  });

  const isOffline = !!errorPurchases;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Layanan supplier offline. Menggunakan data demo lokal.');
    }
  }, [isOffline]);

  // Aggregate dynamically from actual database purchases when online
  const mergedSuppliers = React.useMemo(() => {
    if (isOffline || !purchases || purchases.length === 0) {
      return suppliers;
    }

    return suppliers.map((supplier) => {
      const supplierPurchases = purchases.filter(
        (p) => p.supplier_name.toLowerCase().trim() === supplier.name.toLowerCase().trim()
      );

      const additionalOrders = supplierPurchases.length;
      const lastOrderDate =
        additionalOrders > 0
          ? supplierPurchases.reduce(
              (latest, current) =>
                new Date(current.purchase_date) > new Date(latest) ? current.purchase_date : latest,
              supplierPurchases[0].purchase_date
            )
          : supplier.lastOrderDate;

      return {
        ...supplier,
        totalOrders: supplier.totalOrders + additionalOrders,
        lastOrderDate,
      };
    });
  }, [suppliers, purchases, isOffline]);

  // Interactive Dialog States

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [detailSupplier, setDetailSupplier] = React.useState<Supplier | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [editSupplier, setEditSupplier] = React.useState<Supplier | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteSupplier, setDeleteSupplier] = React.useState<Supplier | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Export handler
  const handleExport = React.useCallback(() => {
    exportToCSV({
      data: mergedSuppliers,
      columns: [
        { header: 'ID Supplier', accessor: (row) => row.id },
        { header: 'Nama Supplier', accessor: (row) => row.name },
        { header: 'Kategori', accessor: (row) => row.category },
        { header: 'Kontak Person', accessor: (row) => row.contactPerson },
        { header: 'Telepon', accessor: (row) => row.phone },
        { header: 'Email', accessor: (row) => row.email },
        { header: 'Lokasi', accessor: (row) => row.location },
        { header: 'Total Order', accessor: (row) => row.totalOrders },
        { header: 'Status', accessor: (row) => (row.status === 'active' ? 'Aktif' : 'Nonaktif') },
      ],
      filename: 'daftar_supplier',
    });
    toast.success('Daftar supplier berhasil diekspor');
  }, [mergedSuppliers]);

  // Actions meta callbacks passed to useReactTable options
  const tableActions: SupplierTableActions = React.useMemo(
    () => ({
      onViewDetail: (supplier) => {
        setDetailSupplier(supplier);
        setDetailDialogOpen(true);
      },
      onEdit: (supplier) => {
        setEditSupplier(supplier);
        setEditDialogOpen(true);
      },
      onDelete: (supplier) => {
        setDeleteSupplier(supplier);
        setDeleteDialogOpen(true);
      },
    }),
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: mergedSuppliers,
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

  // Create handler
  const handleAddSupplier = (data: Omit<Supplier, 'id' | 'totalOrders' | 'lastOrderDate'>) => {
    const newSupplier: Supplier = {
      ...data,
      id: `SUP-${String(Date.now()).slice(-4)}`,
      totalOrders: 0,
      lastOrderDate: new Date().toISOString(),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    setCreateDialogOpen(false);
    toast.success(`Supplier ${data.name} berhasil ditambahkan`);
  };

  // Edit handler
  const handleUpdateSupplier = (data: Omit<Supplier, 'id' | 'totalOrders' | 'lastOrderDate'>) => {
    if (!editSupplier) return;
    setSuppliers((prev) => prev.map((s) => (s.id === editSupplier.id ? { ...s, ...data } : s)));
    setEditDialogOpen(false);
    setEditSupplier(null);
    toast.success(`Profil supplier ${data.name} berhasil diperbarui`);
  };

  // Delete handler
  const handleDeleteSupplier = () => {
    if (!deleteSupplier) return;
    setSuppliers((prev) => prev.filter((s) => s.id !== deleteSupplier.id));
    setDeleteDialogOpen(false);
    setDeleteSupplier(null);
    toast.success('Supplier berhasil dihapus');
  };

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <SupplierHeader onExport={handleExport} onAddSupplier={() => setCreateDialogOpen(true)} />

        {isOffline && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
              <p>
                Layanan Supplier Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
              onClick={() => refetchPurchases()}
              disabled={isRefetchingPurchases}
            >
              {isRefetchingPurchases ? 'Menghubungkan...' : 'Coba Hubungkan Kembali'}
            </Button>
          </div>
        )}

        <SupplierStats suppliers={mergedSuppliers} />
        <SupplierTable table={table} columnsCount={columns.length} isLoading={isLoadingPurchases} />
      </div>

      {/* View Details Dialog */}
      <SupplierDetailDialog
        supplier={detailSupplier}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={() => {
          setDetailDialogOpen(false);
          setEditSupplier(detailSupplier);
          setEditDialogOpen(true);
        }}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Supplier Baru</DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah ini untuk menambahkan supplier baru ke daftar kemitraan
              Anda.
            </DialogDescription>
          </DialogHeader>
          <SupplierForm categories={categoriesData?.data || []} onSuccess={handleAddSupplier} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditSupplier(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ubah Profil Supplier</DialogTitle>
            <DialogDescription>Ubah data rincian profil supplier terpilih.</DialogDescription>
          </DialogHeader>
          {editSupplier && (
            <SupplierForm
              initialData={editSupplier}
              categories={categoriesData?.data || []}
              onSuccess={handleUpdateSupplier}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Supplier?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{deleteSupplier?.name}</strong> dari daftar
              supplier Anda? Tindakan ini akan menghapus data mereka secara permanen dari tampilan
              saat ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              onClick={handleDeleteSupplier}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
