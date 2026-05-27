'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Warehouse, WarehouseTableActions } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nama Gudang
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-slate-900 leading-snug">
          {row.getValue('name')}
        </span>
        <span className="text-xs text-slate-500 mt-0.5">{row.original.location}</span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipe Storage',
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-600">{row.getValue('type')}</span>
    ),
  },
  {
    accessorKey: 'capacity',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Kapasitas
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const capacity = row.getValue('capacity') as number;
      let barColor = 'bg-emerald-500';
      if (capacity >= 90) barColor = 'bg-red-500';
      else if (capacity >= 70) barColor = 'bg-amber-500';

      return (
        <div className="flex w-[120px] flex-col gap-1">
          <span className="text-[10px] font-semibold text-slate-500">{capacity}% Terpakai</span>
          <Progress value={capacity} className={`h-1.5 [&>div]:${barColor}`} />
        </div>
      );
    },
  },
  {
    accessorKey: 'totalItems',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Total Barang
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-slate-800">{row.getValue('totalItems')} SKU</span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      switch (status) {
        case 'active':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Aktif
            </span>
          );
        case 'full':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Penuh
            </span>
          );
        case 'maintenance':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Perbaikan
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              Nonaktif
            </span>
          );
      }
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function ActionsCell({ row, table }) {
      const warehouse = row.original;
      const meta = table.options.meta as WarehouseTableActions | undefined;

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
              onClick={() => meta?.onViewDetail(warehouse)}
            >
              <Eye className="mr-2 h-4 w-4 text-slate-500" />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onEdit(warehouse)}
            >
              <Edit className="mr-2 h-4 w-4 text-slate-500" />
              Edit Gudang
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive text-sm"
              onClick={() => meta?.onDelete(warehouse)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Gudang
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
