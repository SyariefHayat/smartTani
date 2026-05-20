'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerHarvest } from './types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<FarmerHarvest>[] = [
  {
    accessorKey: 'id',
    header: 'ID Panen',
    cell: ({ row }) => (
      <span className="font-mono text-xs">#{(row.getValue('id') as string).substring(0, 8)}</span>
    ),
  },
  {
    accessorKey: 'land.name',
    id: 'landName',
    header: 'Lahan',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900">{row.original.land?.name || 'Lahan'}</span>
        <span className="text-xs text-slate-500 mt-0.5">{row.original.crop_name}</span>
      </div>
    ),
  },
  {
    accessorKey: 'harvest_date',
    header: 'Tanggal Panen',
    cell: ({ row }) => {
      const date = new Date(row.getValue('harvest_date'));
      return <span className="text-sm">{format(date, 'dd MMM yyyy', { locale: id })}</span>;
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Hasil Panen',
    cell: ({ row }) => {
      const quantity = row.original.quantity;
      const unit = row.original.unit;
      return (
        <span className="font-bold text-green-600">
          {quantity} {unit}
        </span>
      );
    },
  },
  {
    accessorKey: 'quality_grade',
    header: 'Kualitas',
    cell: ({ row }) => {
      const grade = row.getValue('quality_grade') as string;
      const config: Record<
        string,
        {
          label: string;
          variant:
            | 'default'
            | 'secondary'
            | 'destructive'
            | 'outline'
            | 'success'
            | 'warning'
            | 'info';
        }
      > = {
        A: { label: 'Grade A', variant: 'success' },
        B: { label: 'Grade B', variant: 'info' },
        C: { label: 'Grade C', variant: 'warning' },
      };
      const { label, variant } = config[grade] || { label: grade, variant: 'outline' };
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const harvest = row.original;
      const meta = table.options.meta as {
        onEdit?: (harvest: FarmerHarvest) => void;
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
            <DropdownMenuItem onClick={() => meta?.onEdit?.(harvest)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Panen
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => meta?.onDelete?.(harvest.id)}
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
