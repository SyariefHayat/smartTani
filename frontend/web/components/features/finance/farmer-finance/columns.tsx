'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerTransaction } from './types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MinusCircle, PlusCircle } from 'lucide-react';

export const columns: ColumnDef<FarmerTransaction>[] = [
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return <span className="text-sm">{format(date, 'dd MMM yyyy, HH:mm', { locale: id })}</span>;
    },
  },
  {
    accessorKey: 'description',
    header: 'Keterangan',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue('description')}</span>
        <span className="text-xs text-muted-foreground font-mono">ID: {row.original.id}</span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      if (type === 'revenue') {
        return (
          <div className="flex items-center text-green-600 gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Penjualan</span>
          </div>
        );
      }
      return (
        <div className="flex items-center text-rose-600 gap-1.5">
          <MinusCircle className="h-4 w-4" />
          <span className="text-sm font-medium">Penarikan</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Jumlah',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const type = row.original.type;
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);

      return (
        <span className={`font-bold ${type === 'revenue' ? 'text-green-600' : 'text-rose-600'}`}>
          {type === 'revenue' ? '+' : '-'} {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const config: Record<
        string,
        { label: string; variant: 'success' | 'warning' | 'destructive' }
      > = {
        success: { label: 'Berhasil', variant: 'success' },
        pending: { label: 'Diproses', variant: 'warning' },
        failed: { label: 'Gagal', variant: 'destructive' },
      };
      const { label, variant } = config[status] || { label: status, variant: 'outline' };
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
];
