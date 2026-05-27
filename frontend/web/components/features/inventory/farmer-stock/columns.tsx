'use client';

import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ProductStock, StockTableActions } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, AlertCircle, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export const columns: ColumnDef<ProductStock>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nama Produk
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <span className="font-semibold text-sm text-slate-900 leading-snug">
          {row.getValue('name')}
        </span>
        <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">
          {row.original.sku}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-600">{row.getValue('category')}</span>
    ),
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Jumlah Stok
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number;
      const unit = row.original.unit;
      const minStock = row.original.minStock;
      const isLow = quantity <= minStock && quantity > 0;
      const isOut = quantity === 0;

      return (
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-sm font-bold tracking-tight ${
              isOut ? 'text-red-600' : isLow ? 'text-amber-600' : 'text-slate-900'
            }`}
          >
            {quantity.toLocaleString('id-ID')}{' '}
            <span className="text-xs font-normal text-slate-400 ml-0.5">{unit}</span>
          </span>
          <span className="text-[10px] text-slate-400">
            Min. {minStock} {unit}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'warehouse',
    header: 'Lokasi Gudang',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-600">{row.getValue('warehouse')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      switch (status) {
        case 'In Stock':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Tersedia
            </span>
          );
        case 'Low Stock':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Menipis
            </span>
          );
        case 'Out of Stock':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Habis
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              {status}
            </span>
          );
      }
    },
  },
  {
    accessorKey: 'lastUpdated',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Update Terakhir
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-500">
        {format(new Date(row.getValue('lastUpdated')), 'dd MMM yyyy')}
      </span>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function ActionsCell({ row, table }) {
      const product = row.original;
      const meta = table.options.meta as StockTableActions | undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onUpdateStock(product)}
            >
              <Edit className="mr-2 h-4 w-4 text-slate-500" />
              Update Stok
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onSetMinStock(product)}
            >
              <AlertCircle className="mr-2 h-4 w-4 text-slate-500" />
              Set Min. Stok
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
