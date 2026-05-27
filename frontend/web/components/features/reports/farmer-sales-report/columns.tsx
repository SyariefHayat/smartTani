'use client';

import { ColumnDef } from '@tanstack/react-table';
import { SalesReportItem } from './types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const columns: ColumnDef<SalesReportItem>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-slate-100 font-semibold text-slate-700 h-8 text-sm"
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return (
        <span className="text-sm font-medium text-slate-600">
          {format(date, 'dd MMM yyyy', { locale: id })}
        </span>
      );
    },
  },
  {
    accessorKey: 'id',
    header: 'ID Pesanan',
    cell: ({ row }) => (
      <span className="font-mono text-xs text-slate-500 font-semibold bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">
        #{row.getValue('id')}
      </span>
    ),
  },
  {
    accessorKey: 'customerName',
    header: 'Pelanggan',
    cell: ({ row }) => (
      <span className="font-semibold text-sm text-slate-800">{row.getValue('customerName')}</span>
    ),
  },
  {
    accessorKey: 'productName',
    header: 'Produk',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-slate-700">{row.getValue('productName')}</span>
        <span className="text-xs text-slate-500">{row.original.quantity} unit</span>
      </div>
    ),
  },
  {
    accessorKey: 'total',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-slate-100 font-semibold text-slate-700 h-8 text-sm"
        >
          Total
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('total'));
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
      return <span className="font-bold text-emerald-600">{formatted}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="-ml-4 hover:bg-slate-100 font-semibold text-slate-700 h-8 text-sm"
        >
          Status
          <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const isCompleted = status === 'completed';
      return (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors',
            isCompleted
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-rose-50 text-rose-700 border-rose-200'
          )}
        >
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              isCompleted ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            )}
          />
          {isCompleted ? 'Selesai' : 'Batal'}
        </span>
      );
    },
  },
];
