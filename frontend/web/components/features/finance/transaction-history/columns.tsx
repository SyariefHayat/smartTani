'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Transaction } from './types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, ExternalLink, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => {
      const date = new Date(row.getValue('date'));
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{format(date, 'dd MMM yyyy', { locale: id })}</span>
          <span className="text-[10px] text-muted-foreground">{format(date, 'HH:mm')}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Keterangan',
    cell: ({ row }) => (
      <div className="flex flex-col max-w-[250px]">
        <span className="text-sm font-medium truncate">{row.getValue('description')}</span>
        <span className="text-[10px] text-muted-foreground italic">
          Ref: {row.original.referenceId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipe',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return (
        <Badge
          variant={type === 'Income' || type === 'TopUp' ? 'success' : 'destructive'}
          className="h-5 text-[10px]"
        >
          {type === 'Income'
            ? 'Masuk'
            : type === 'Expense'
              ? 'Keluar'
              : type === 'Withdrawal'
                ? 'Tarik'
                : 'Top Up'}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => <span className="text-sm">{row.getValue('category')}</span>,
  },
  {
    accessorKey: 'amount',
    header: 'Nominal',
    cell: ({ row }) => {
      const amount = row.getValue('amount') as number;
      const type = row.original.type;
      const isNegative = type === 'Expense' || type === 'Withdrawal';

      return (
        <span className={`text-sm font-bold ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
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
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const variant =
        status === 'Completed' ? 'success' : status === 'Pending' ? 'warning' : 'destructive';
      return (
        <Badge variant={variant} className="h-5 text-[10px]">
          {status === 'Completed' ? 'Berhasil' : status === 'Pending' ? 'Proses' : 'Gagal'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: () => {
      return (
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
              Detail Transaksi
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="mr-2 h-4 w-4" />
              Lihat Referensi
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download Bukti
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
