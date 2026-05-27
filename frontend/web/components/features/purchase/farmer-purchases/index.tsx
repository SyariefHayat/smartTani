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
import { RefreshCw } from 'lucide-react';
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

  const {
    data: purchases = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['farmer-purchases'],
    queryFn: () => purchaseService.getPurchases(),
  });

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

        {error ? (
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
            <p className="font-semibold text-base mb-1">Gagal Memuat Data Pengeluaran</p>
            <p className="text-xs text-red-400 max-w-md mb-4">
              Layanan/Service tidak merespon atau sedang tidak aktif. Harap periksa koneksi Anda
              atau hubungi administrator.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
              {isRefetching ? 'Mencoba ulang...' : 'Coba Lagi'}
            </Button>
          </div>
        ) : (
          <>
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
          </>
        )}
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
