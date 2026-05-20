'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerLand } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Edit, Trash2, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<FarmerLand>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Lahan',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900">{row.getValue('name')}</span>
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
          <MapPin className="h-3 w-3" />
          <span>
            {row.original.location_district}, {row.original.location_city}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'area_ha',
    header: 'Luas (Ha)',
    cell: ({ row }) => <span className="font-medium">{row.getValue('area_ha')} Ha</span>,
  },
  {
    accessorKey: 'current_crop',
    header: 'Komoditas',
    cell: ({ row }) => {
      const crop = row.original.current_crop;
      if (!crop) return <span className="text-xs text-slate-400 italic">Tidak ada tanaman</span>;
      return <span className="font-medium text-slate-700">{crop}</span>;
    },
  },
  {
    accessorKey: 'soil_type',
    header: 'Tipe Tanah',
    cell: ({ row }) => {
      const soil = row.original.soil_type;
      return <span className="text-slate-600">{soil || '-'}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const config: Record<
        string,
        {
          label: string;
          variant: 'success' | 'warning' | 'secondary' | 'outline' | 'default';
        }
      > = {
        active: { label: 'Aktif', variant: 'success' },
        fallow: { label: 'Bera/Kosong', variant: 'warning' },
        rented: { label: 'Disewakan', variant: 'secondary' },
      };
      const item = config[status] || { label: status, variant: 'outline' };
      return <Badge variant={item.variant}>{item.label}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const land = row.original;
      const meta = table.options.meta as {
        onEdit?: (land: FarmerLand) => void;
        onDelete?: (id: string) => void;
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => meta?.onEdit?.(land)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Lahan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
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
