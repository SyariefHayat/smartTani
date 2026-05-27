'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PurchaseRecord, PurchaseTableActions } from './types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2, FileText } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<PurchaseRecord>[] = [
  {
    accessorKey: 'purchase_date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('purchase_date'));
      return <span className="text-sm">{format(date, 'dd MMM yyyy', { locale: id })}</span>;
    },
  },
  {
    accessorKey: 'item_name',
    header: 'Barang',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm text-slate-900">{row.getValue('item_name')}</span>
        <span className="text-xs text-slate-500">
          {row.original.quantity} {row.original.unit}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'supplier_name',
    header: 'Pemasok',
    cell: ({ row }) => <span className="text-sm">{row.getValue('supplier_name')}</span>,
  },
  {
    accessorKey: 'total_cost',
    header: 'Total Biaya',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total_cost'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <span className="font-bold text-slate-900">{formatted}</span>;
    },
  },
  {
    accessorKey: 'notes',
    header: 'Catatan',
    cell: ({ row }) => (
      <span className="text-sm text-slate-500 line-clamp-1 max-w-[200px]">
        {row.getValue('notes') || '-'}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: function ActionsCell({ row, table }) {
      const purchase = row.original;
      const meta = table.options.meta as PurchaseTableActions | undefined;

      return (
        <div className="flex items-center justify-end gap-2">
          {purchase.receipt_url && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 cursor-pointer"
              onClick={() => window.open(purchase.receipt_url, '_blank')}
            >
              <FileText className="h-4 w-4 text-blue-600" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer text-sm"
                onClick={() => meta?.onViewDetail(purchase)}
              >
                <Eye className="mr-2 h-4 w-4 text-slate-500" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-sm"
                onClick={() => meta?.onEdit(purchase)}
              >
                <Edit className="mr-2 h-4 w-4 text-slate-500" />
                Ubah Data
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive text-sm"
                onClick={() => meta?.onDelete(purchase)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
