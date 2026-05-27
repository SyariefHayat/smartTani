'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Transaction } from './types';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Eye,
  ExternalLink,
  Download,
  ArrowUpDown,
  PlusCircle,
  MinusCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export interface TransactionTableActions {
  onViewDetail?: (transaction: Transaction) => void;
  onViewReference?: (transaction: Transaction) => void;
  onDownloadReceipt?: (transaction: Transaction) => void;
}

export const columns: ColumnDef<Transaction>[] = [
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
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-700">
            {format(date, 'dd MMM yyyy', { locale: id })}
          </span>
          <span className="text-[10px] text-slate-400 font-medium mt-0.5">
            {format(date, 'HH:mm')}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Keterangan',
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px]">
        <span className="text-sm font-bold text-slate-900 truncate leading-snug">
          {row.getValue('description')}
        </span>
        <span className="text-[10px] text-slate-400 font-mono mt-0.5">
          Ref: {row.original.referenceId || '-'}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      switch (type) {
        case 'Income':
          return (
            <div className="flex items-center text-emerald-600 gap-1.5 font-semibold text-[10px] bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-0.5 w-fit tracking-wide uppercase">
              <PlusCircle className="h-3 w-3 shrink-0" />
              <span>Masuk</span>
            </div>
          );
        case 'Expense':
          return (
            <div className="flex items-center text-rose-600 gap-1.5 font-semibold text-[10px] bg-rose-50 border border-rose-100 rounded-full px-2.5 py-0.5 w-fit tracking-wide uppercase">
              <MinusCircle className="h-3 w-3 shrink-0" />
              <span>Keluar</span>
            </div>
          );
        case 'Withdrawal':
          return (
            <div className="flex items-center text-blue-600 gap-1.5 font-semibold text-[10px] bg-blue-50 border border-blue-100 rounded-full px-2.5 py-0.5 w-fit tracking-wide uppercase">
              <ArrowUpRight className="h-3 w-3 shrink-0" />
              <span>Tarik</span>
            </div>
          );
        case 'TopUp':
        default:
          return (
            <div className="flex items-center text-purple-600 gap-1.5 font-semibold text-[10px] bg-purple-50 border border-purple-100 rounded-full px-2.5 py-0.5 w-fit tracking-wide uppercase">
              <ArrowDownLeft className="h-3 w-3 shrink-0" />
              <span>Top Up</span>
            </div>
          );
      }
    },
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-slate-650">{row.getValue('category')}</span>
    ),
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nominal
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const type = row.original.type;
      const isNegative = type === 'Expense' || type === 'Withdrawal';

      return (
        <span className={`text-sm font-bold ${isNegative ? 'text-rose-600' : 'text-emerald-600'}`}>
          {isNegative ? '-' : '+'}{' '}
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
          }).format(amount)}
        </span>
      );
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      switch (status) {
        case 'Completed':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Berhasil
            </span>
          );
        case 'Pending':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Proses
            </span>
          );
        case 'Failed':
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
  {
    id: 'actions',
    enableHiding: false,
    cell: function ActionsCell({ row, table }) {
      const transaction = row.original;
      const meta = table.options.meta as TransactionTableActions | undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onViewDetail?.(transaction)}
            >
              <Eye className="mr-2 h-4 w-4 text-slate-500" />
              Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onViewReference?.(transaction)}
            >
              <ExternalLink className="mr-2 h-4 w-4 text-slate-500" />
              Lihat Ref
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onDownloadReceipt?.(transaction)}
            >
              <Download className="mr-2 h-4 w-4 text-slate-500" />
              Unduh Bukti
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
