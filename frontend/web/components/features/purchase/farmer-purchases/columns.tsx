'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerPurchase } from './types';
import { OrderStatusBadge } from '../../order/OrderStatusBadge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, PackageCheck } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<FarmerPurchase>[] = [
  {
    accessorKey: 'id',
    header: 'ID Pembelian',
    cell: ({ row }) => <span className="font-mono text-xs">#{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return <span className="text-sm">{format(date, 'dd MMM yyyy', { locale: id })}</span>;
    },
  },
  {
    accessorKey: 'supplierName',
    header: 'Supplier',
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue('supplierName')}</span>,
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Biaya',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <span className="font-bold text-slate-900">{formatted}</span>;
    },
  },
  {
    accessorKey: 'paymentMethod',
    header: 'Metode',
    cell: ({ row }) => <span className="text-sm">{row.getValue('paymentMethod')}</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      // Map simplified internal status to OrderStatusBadge status
      const status = row.getValue('status') as string;
      const statusMap: Record<string, string> = {
        pending: 'pending_payment',
        processing: 'paid',
        shipped: 'shipped',
        delivered: 'delivered',
        completed: 'delivered',
        cancelled: 'cancelled',
      };
      return <OrderStatusBadge status={statusMap[status] || status} />;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const purchase = row.original;

      return (
        <div className="flex items-center gap-2">
          {purchase.status === 'shipped' && (
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 h-8">
              <PackageCheck className="mr-1 h-3.5 w-3.5" />
              Selesai
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem>Hubungi Supplier</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
