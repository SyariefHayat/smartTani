'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SalesReportItem } from './types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

export const columns: ColumnDef<SalesReportItem>[] = [
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return <span className="text-sm">{format(date, 'dd MMM yyyy', { locale: id })}</span>;
    },
  },
  {
    accessorKey: 'id',
    header: 'ID Pesanan',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">#{row.getValue('id')}</span>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Pelanggan',
    cell: ({ row }) => <span className="font-medium text-sm">{row.getValue('customerName')}</span>,
  },
  {
    accessorKey: 'productName',
    header: 'Produk',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm">{row.getValue('productName')}</span>
        <span className="text-xs text-muted-foreground">{row.original.quantity} unit</span>
      </div>
    ),
  },
  {
    accessorKey: 'total',
    header: 'Total',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <span className="font-bold text-green-600">{formatted}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge
          variant={status === 'completed' ? 'success' : 'destructive'}
          className="text-[10px] uppercase tracking-wider"
        >
          {status === 'completed' ? 'Selesai' : 'Batal'}
        </Badge>
      );
    },
  },
];
