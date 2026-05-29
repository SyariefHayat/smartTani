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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { PurchaseHeader } from './PurchaseHeader';
import { PurchaseStats } from './PurchaseStats';
import { PurchaseTable } from './PurchaseTable';
import { columns } from './columns';
import { purchaseService } from '@/services/purchase';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';
import { toast } from 'sonner';
import { PurchaseRecord, PurchaseTableActions } from './types';
import { PurchaseForm } from './PurchaseForm';
import { PurchaseDetailDialog } from './PurchaseDetailDialog';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function FarmerPurchaseList() {
  const queryClient = useQueryClient();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog States
  const [detailRecord, setDetailRecord] = React.useState<PurchaseRecord | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [editRecord, setEditRecord] = React.useState<PurchaseRecord | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteRecord, setDeleteRecord] = React.useState<PurchaseRecord | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => purchaseService.deletePurchase(id),
    onSuccess: () => {
      toast.success('Catatan pengeluaran berhasil dihapus');
      queryClient.invalidateQueries({ queryKey: ['farmer-purchases'] });
      refetch();
      setDeleteDialogOpen(false);
      setDeleteRecord(null);
    },
    onError: () => {
      toast.error('Gagal menghapus catatan pengeluaran');
    },
  });

  // Table Action Handlers
  const tableActions: PurchaseTableActions = React.useMemo(
    () => ({
      onViewDetail: (record) => {
        setDetailRecord(record);
        setDetailDialogOpen(true);
      },
      onEdit: (record) => {
        setEditRecord(record);
        setEditDialogOpen(true);
      },
      onDelete: (record) => {
        setDeleteRecord(record);
        setDeleteDialogOpen(true);
      },
    }),
    []
  );

  const mockPurchases = React.useMemo(
    () => [
      {
        id: 'mock-pur-1',
        farmer_id: 'mock-farmer',
        purchase_date: new Date().toISOString(),
        item_name: 'Pupuk Urea Subur',
        supplier_name: 'UD. Tani Subur',
        quantity: 10,
        unit: 'karung',
        total_cost: 1200000,
        notes: 'Untuk persiapan musim tanam padi.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mock-pur-2',
        farmer_id: 'mock-farmer',
        purchase_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        item_name: 'Benih Jagung Hibrida',
        supplier_name: 'Toko Tani Jaya',
        quantity: 5,
        unit: 'kg',
        total_cost: 450000,
        notes: 'Benih jagung hibrida F1.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    []
  );

  const {
    data: rawPurchases = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['farmer-purchases'],
    queryFn: () => purchaseService.getPurchases(),
  });

  const isOffline = !!error;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Layanan pengeluaran sedang offline. Menggunakan data demo lokal.');
    }
  }, [isOffline]);

  const purchases = React.useMemo(() => {
    if (isOffline || !rawPurchases || rawPurchases.length === 0) {
      return mockPurchases;
    }
    return rawPurchases;
  }, [rawPurchases, isOffline, mockPurchases]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: purchases,
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

  React.useEffect(() => {
    table.setPageIndex(0);
  }, [columnFilters]);

  const handleExport = React.useCallback(() => {
    if (purchases.length === 0) {
      toast.error('Tidak ada data pengeluaran untuk di-export');
      return;
    }

    exportToCSV({
      data: purchases,
      columns: [
        { header: 'ID', accessor: (row) => row.id },
        { header: 'Tanggal', accessor: (row) => row.purchase_date.split('T')[0] },
        { header: 'Barang', accessor: (row) => row.item_name },
        { header: 'Pemasok', accessor: (row) => row.supplier_name },
        { header: 'Jumlah', accessor: (row) => row.quantity },
        { header: 'Satuan', accessor: (row) => row.unit },
        { header: 'Total Biaya', accessor: (row) => row.total_cost },
        { header: 'Catatan', accessor: (row) => row.notes || '' },
      ],
      filename: 'catatan_pengeluaran',
    });
    toast.success('Data pengeluaran berhasil di-export');
  }, [purchases]);

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <PurchaseHeader onExport={handleExport} onSuccess={refetch} />

        {isOffline && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
              <p>
                Layanan Pengeluaran Offline: Gagal memuat data teraktual. Menggunakan data demo
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
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <PurchaseStats purchases={purchases} />
        )}

        <PurchaseTable table={table} columnsCount={columns.length} isLoading={isLoading} />
      </div>

      {/* Detail Dialog */}
      <PurchaseDetailDialog
        purchase={detailRecord}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={() => {
          setDetailDialogOpen(false);
          setEditRecord(detailRecord);
          setEditDialogOpen(true);
        }}
      />

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditRecord(null);
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ubah Catatan Pengeluaran</DialogTitle>
            <DialogDescription>Ubah data catatan pengeluaran usaha tani Anda.</DialogDescription>
          </DialogHeader>
          {editRecord && (
            <PurchaseForm
              initialData={editRecord}
              onSuccess={() => {
                setEditDialogOpen(false);
                setEditRecord(null);
                refetch();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Catatan Pengeluaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus catatan pengeluaran ini secara permanen? Tindakan
              ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              onClick={() => deleteRecord && deleteMutation.mutate(deleteRecord.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
