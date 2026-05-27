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

import { WarehouseHeader } from './WarehouseHeader';
import { WarehouseStats } from './WarehouseStats';
import { WarehouseTable } from './WarehouseTable';
import { columns } from './columns';
import { Warehouse, WarehouseTableActions } from './types';
import { exportToCSV } from '@/lib/export-csv';
import { toast } from 'sonner';
import { WarehouseForm } from './WarehouseForm';
import { WarehouseDetailDialog } from './WarehouseDetailDialog';

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

const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'WHS-001',
    name: 'Gudang Pusat Utama',
    location: 'Sidoarjo, Jawa Timur',
    type: 'Dry Storage',
    capacity: 75,
    totalItems: 120,
    lastUpdate: '2024-05-15T08:00:00Z',
    status: 'active',
  },
  {
    id: 'WHS-002',
    name: 'Cold Storage A1',
    location: 'Surabaya, Jawa Timur',
    type: 'Cold Storage',
    capacity: 92,
    totalItems: 45,
    lastUpdate: '2024-05-16T09:30:00Z',
    status: 'active',
  },
  {
    id: 'WHS-003',
    name: 'Silo Jagung Utara',
    location: 'Mojokerto, Jawa Timur',
    type: 'Silo',
    capacity: 30,
    totalItems: 15,
    lastUpdate: '2024-05-14T14:20:00Z',
    status: 'active',
  },
  {
    id: 'WHS-004',
    name: 'Gudang Pupuk Barat',
    location: 'Gresik, Jawa Timur',
    type: 'Dry Storage',
    capacity: 100,
    totalItems: 200,
    lastUpdate: '2024-05-10T11:00:00Z',
    status: 'full',
  },
  {
    id: 'WHS-005',
    name: 'Storage Pendingin B2',
    location: 'Malang, Jawa Timur',
    type: 'Cold Storage',
    capacity: 0,
    totalItems: 0,
    lastUpdate: '2024-05-01T16:00:00Z',
    status: 'maintenance',
  },
];

export function FarmerWarehouseManagement() {
  const [warehouses, setWarehouses] = React.useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Interactive Dialog States
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [detailWarehouse, setDetailWarehouse] = React.useState<Warehouse | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [editWarehouse, setEditWarehouse] = React.useState<Warehouse | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteWarehouse, setDeleteWarehouse] = React.useState<Warehouse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Export handler
  const handleExport = React.useCallback(() => {
    const statusLabels: Record<string, string> = {
      active: 'Aktif',
      full: 'Penuh',
      maintenance: 'Perbaikan',
      inactive: 'Nonaktif',
    };

    exportToCSV({
      data: warehouses,
      columns: [
        { header: 'ID Gudang', accessor: (row) => row.id },
        { header: 'Nama Gudang', accessor: (row) => row.name },
        { header: 'Lokasi', accessor: (row) => row.location },
        { header: 'Tipe Storage', accessor: (row) => row.type },
        { header: 'Kapasitas Terpakai (%)', accessor: (row) => row.capacity },
        { header: 'Total Item (SKU)', accessor: (row) => row.totalItems },
        { header: 'Status', accessor: (row) => statusLabels[row.status] || row.status },
      ],
      filename: 'daftar_gudang_penyimpanan',
    });
    toast.success('Daftar gudang berhasil diekspor');
  }, [warehouses]);

  // Actions meta callbacks passed to react-table options
  const tableActions: WarehouseTableActions = React.useMemo(
    () => ({
      onViewDetail: (warehouse) => {
        setDetailWarehouse(warehouse);
        setDetailDialogOpen(true);
      },
      onEdit: (warehouse) => {
        setEditWarehouse(warehouse);
        setEditDialogOpen(true);
      },
      onDelete: (warehouse) => {
        setDeleteWarehouse(warehouse);
        setDeleteDialogOpen(true);
      },
    }),
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: warehouses,
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
  });

  // Create handler
  const handleAddWarehouse = (data: Omit<Warehouse, 'id' | 'totalItems' | 'lastUpdate'>) => {
    const newWarehouse: Warehouse = {
      ...data,
      id: `WHS-${String(Date.now()).slice(-4)}`,
      totalItems: 0,
      lastUpdate: new Date().toISOString(),
    };
    setWarehouses((prev) => [newWarehouse, ...prev]);
    setCreateDialogOpen(false);
    toast.success(`Gudang ${data.name} berhasil ditambahkan`);
  };

  // Edit handler
  const handleUpdateWarehouse = (data: Omit<Warehouse, 'id' | 'totalItems' | 'lastUpdate'>) => {
    if (!editWarehouse) return;
    setWarehouses((prev) =>
      prev.map((w) =>
        w.id === editWarehouse.id ? { ...w, ...data, lastUpdate: new Date().toISOString() } : w
      )
    );
    setEditDialogOpen(false);
    setEditWarehouse(null);
    toast.success(`Data gudang ${data.name} berhasil diperbarui`);
  };

  // Delete handler
  const handleDeleteWarehouse = () => {
    if (!deleteWarehouse) return;
    setWarehouses((prev) => prev.filter((w) => w.id !== deleteWarehouse.id));
    setDeleteDialogOpen(false);
    setDeleteWarehouse(null);
    toast.success('Gudang berhasil dihapus');
  };

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <WarehouseHeader onExport={handleExport} onAddWarehouse={() => setCreateDialogOpen(true)} />
        <WarehouseStats warehouses={warehouses} />
        <WarehouseTable table={table} columnsCount={columns.length} />
      </div>

      {/* View Details Dialog */}
      <WarehouseDetailDialog
        warehouse={detailWarehouse}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={() => {
          setDetailDialogOpen(false);
          setEditWarehouse(detailWarehouse);
          setEditDialogOpen(true);
        }}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tambah Gudang Penyimpanan Baru</DialogTitle>
            <DialogDescription>
              Lengkapi formulir di bawah ini untuk menambahkan gudang penyimpanan baru.
            </DialogDescription>
          </DialogHeader>
          <WarehouseForm onSuccess={handleAddWarehouse} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditWarehouse(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ubah Data Gudang</DialogTitle>
            <DialogDescription>Ubah data rincian profil gudang terpilih.</DialogDescription>
          </DialogHeader>
          {editWarehouse && (
            <WarehouseForm initialData={editWarehouse} onSuccess={handleUpdateWarehouse} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Gudang Penyimpanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus <strong>{deleteWarehouse?.name}</strong> dari
              sistem? Tindakan ini akan menghapus data secara permanen dari daftar gudang Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              onClick={handleDeleteWarehouse}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
