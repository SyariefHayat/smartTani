'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerHarvest } from './types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Eye, Edit2, ClipboardCheck, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<FarmerHarvest>[] = [
  {
    accessorKey: 'id',
    header: 'ID Panen',
    cell: ({ row }) => <span className="font-mono text-xs">#{row.getValue('id')}</span>,
  },
  {
    accessorKey: 'landName',
    header: 'Lahan',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue('landName')}</span>
        <span className="text-xs text-muted-foreground">{row.original.cropName}</span>
      </div>
    ),
  },
  {
    accessorKey: 'harvestDate',
    header: 'Tanggal Panen',
    cell: ({ row }) => {
      const date = new Date(row.getValue('harvestDate'));
      return <span className="text-sm">{format(date, 'dd MMM yyyy', { locale: id })}</span>;
    },
  },
  {
    accessorKey: 'actualYield',
    header: 'Hasil Panen',
    cell: ({ row }) => {
      const actual = row.original.actualYield;
      const expected = row.original.expectedYield;
      const unit = row.original.unit;

      if (!actual)
        return (
          <span className="text-sm text-muted-foreground italic">
            Est: {expected} {unit}
          </span>
        );

      return (
        <span className="font-bold text-green-600">
          {actual} {unit}
        </span>
      );
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
        completed: { label: 'Selesai', variant: 'success' },
        ongoing: { label: 'Berlangsung', variant: 'info' },
        scheduled: { label: 'Terjadwal', variant: 'warning' },
        cancelled: { label: 'Batal', variant: 'secondary' },
      };
      const { label, variant } = config[status] || { label: status, variant: 'outline' };
      return <Badge variant={variant}>{label}</Badge>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const harvest = row.original;
      return (
        <div className="flex items-center gap-2">
          {harvest.status === 'scheduled' && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8">
              <ClipboardCheck className="mr-1 h-3.5 w-3.5" />
              Catat
            </Button>
          )}
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
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit2 className="mr-2 h-4 w-4" />
                Edit Jadwal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
