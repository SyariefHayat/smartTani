'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerOrder } from './types';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, CheckCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<FarmerOrder>[] = [
  {
    accessorKey: 'id',
    header: 'ID Pesanan',
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
    accessorKey: 'customerName',
    header: 'Pelanggan',
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue('customerName')}</span>,
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Penghasilan',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('totalAmount'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <span className="font-bold text-green-600">{formatted}</span>;
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
    cell: ({ row }) => <OrderStatusBadge status={row.getValue('status')} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const order = row.original;

      return (
        <div className="flex items-center gap-2">
          {order.status === 'paid' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8">
              <CheckCircle className="mr-1 h-3.5 w-3.5" />
              Konfirmasi
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
              <DropdownMenuItem className="text-destructive">Batalkan Pesanan</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
