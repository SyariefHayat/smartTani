'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerLand } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, MapPin, ArrowUpDown, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<FarmerLand>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Nama Lahan
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-slate-900 leading-snug">
          {row.getValue('name')}
        </span>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
          <MapPin className="h-3 w-3 text-slate-400" />
          <span>
            {row.original.location_district}, {row.original.location_city}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'area_ha',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Luas (Ha)
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-bold text-slate-900">{row.getValue('area_ha')} Ha</span>
    ),
  },
  {
    accessorKey: 'current_crop',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Komoditas
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const crop = row.original.current_crop;
      if (!crop) return <span className="text-xs text-slate-400 italic">Tidak ada tanaman</span>;
      return <span className="text-sm font-semibold text-slate-700">{crop}</span>;
    },
  },
  {
    accessorKey: 'soil_type',
    header: 'Tipe Tanah',
    cell: ({ row }) => {
      const soil = row.original.soil_type;
      return <span className="text-sm text-slate-600">{soil || '-'}</span>;
    },
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
        case 'fallow':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
              Bera/Kosong
            </span>
          );
        case 'rented':
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              Disewakan
            </span>
          );
        default:
          return (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              {status}
            </span>
          );
      }
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: function ActionsCell({ row, table }) {
      const land = row.original;
      const meta = table.options.meta as {
        onViewDetail?: (land: FarmerLand) => void;
        onEdit?: (land: FarmerLand) => void;
        onDelete?: (id: string) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="cursor-pointer">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onViewDetail?.(land)}
            >
              <Eye className="mr-2 h-4 w-4 text-slate-500" />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onEdit?.(land)}
            >
              <Edit className="mr-2 h-4 w-4 text-slate-500" />
              Edit Lahan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive text-sm"
              onClick={() => meta?.onDelete?.(land.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Lahan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
