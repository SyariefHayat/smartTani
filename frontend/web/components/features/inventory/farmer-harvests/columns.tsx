'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerHarvest, HarvestTableActions } from './types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<FarmerHarvest>[] = [
  {
    accessorKey: 'id',
    header: 'ID Panen',
    cell: ({ row }) => (
      <span className="font-mono text-xs font-semibold text-slate-500">
        #{(row.getValue('id') as string).substring(0, 8)}
      </span>
    ),
  },
  {
    accessorKey: 'land.name',
    id: 'landName',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Lahan
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-slate-900 leading-snug">
          {row.original.land?.name || 'Lahan Utama'}
        </span>
        <span className="text-xs text-slate-500 mt-0.5 font-medium">{row.original.crop_name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'harvest_date',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Tanggal Panen
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('harvest_date'));
      return (
        <span className="text-sm font-medium text-slate-600">
          {format(date, 'dd MMM yyyy', { locale: id })}
        </span>
      );
    },
  },
  {
    accessorKey: 'quantity',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Hasil Panen
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const unit = row.original.unit;
      return (
        <span className="text-sm font-bold text-emerald-600">
          {quantity.toLocaleString('id-ID')} {unit}
        </span>
      );
    },
  },
  {
    accessorKey: 'quality_grade',
    header: 'Kualitas',
    cell: ({ row }) => {
      const grade = row.getValue('quality_grade') as string;
      switch (grade) {
        case 'A':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Grade A
            </span>
          );
        case 'B':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Grade B
            </span>
          );
        case 'C':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Grade C
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              {grade}
            </span>
          );
      }
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function ActionsCell({ row, table }) {
      const harvest = row.original;
      const meta = table.options.meta as HarvestTableActions | undefined;

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
              onClick={() => meta?.onViewDetail(harvest)}
            >
              <Eye className="mr-2 h-4 w-4 text-slate-500" />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onEdit(harvest)}
            >
              <Edit className="mr-2 h-4 w-4 text-slate-500" />
              Edit Panen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive text-sm"
              onClick={() => meta?.onDelete(harvest)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Panen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
