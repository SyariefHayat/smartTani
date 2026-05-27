'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerTransaction } from './types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { MinusCircle, PlusCircle, ArrowUpDown, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<FarmerTransaction>[] = [
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Tanggal
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return (
        <span className="text-sm font-medium text-slate-600">
          {format(date, 'dd MMM yyyy, HH:mm', { locale: id })}
        </span>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Keterangan',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-slate-900 leading-snug">
          {row.getValue('description')}
        </span>
        <span className="text-[10px] text-slate-400 mt-0.5 font-mono">ID: {row.original.id}</span>
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
          <div className="flex items-center text-emerald-600 gap-1.5 font-semibold text-xs bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 w-fit">
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Penjualan</span>
          </div>
        );
      }
      if (type === 'fee') {
        return (
          <div className="flex items-center text-amber-600 gap-1.5 font-semibold text-xs bg-amber-50 border border-amber-100 rounded-full px-2.5 py-0.5 w-fit">
            <MinusCircle className="h-3.5 w-3.5" />
            <span>Biaya Layanan</span>
          </div>
        );
      }
      return (
        <div className="flex items-center text-rose-600 gap-1.5 font-semibold text-xs bg-rose-50 border border-rose-100 rounded-full px-2.5 py-0.5 w-fit">
          <ArrowUpRight className="h-3.5 w-3.5" />
          <span>Penarikan</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Jumlah
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const type = row.original.type;
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);

      return (
        <span
          className={`text-sm font-bold ${
            type === 'revenue'
              ? 'text-emerald-600'
              : type === 'fee'
                ? 'text-amber-600'
                : 'text-rose-600'
          }`}
        >
          {type === 'revenue' ? '+' : '-'} {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = (row.getValue('status') as string) || 'success';
      switch (status) {
        case 'success':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Berhasil
            </span>
          );
        case 'pending':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Diproses
            </span>
          );
        case 'failed':
        default:
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Gagal
            </span>
          );
      }
    },
  },
];
