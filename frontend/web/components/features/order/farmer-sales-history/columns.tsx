'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerOrder } from '../farmer-orders/types';
import { OrderStatusBadge } from '../OrderStatusBadge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Eye, FileText } from 'lucide-react';

export const columns: ColumnDef<FarmerOrder>[] = [
  {
    accessorKey: 'id',
    header: 'ID Pesanan',
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-slate-700">#{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return (
        <span className="text-sm text-slate-600">
          {format(date, 'dd MMM yyyy', { locale: id })}
        </span>
      );
    },
  },
  {
    accessorKey: 'customerName',
    header: 'Pelanggan',
    cell: ({ row }) => (
      <span className="font-medium text-sm text-slate-800">{row.getValue('customerName')}</span>
    ),
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Penjualan',
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
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">{row.getValue('paymentMethod')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <OrderStatusBadge status={row.getValue('status')} />,
  },
  {
    id: 'actions',
    header: 'Aksi',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          >
            <Eye className="mr-1 h-3.5 w-3.5" />
            Detail
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
          >
            <FileText className="mr-1 h-3.5 w-3.5" />
            Invoice
          </Button>
        </div>
      );
    },
  },
];
