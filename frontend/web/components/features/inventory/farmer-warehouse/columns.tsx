'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Warehouse } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<Warehouse>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Gudang',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.getValue('name')}</span>
        <span className="text-xs text-muted-foreground">{row.original.location}</span>
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'Tipe Storage',
    cell: ({ row }) => <span className="text-sm">{row.getValue('type')}</span>,
  },
  {
    accessorKey: 'capacity',
    header: 'Kapasitas',
    cell: ({ row }) => {
      const capacity = row.getValue('capacity') as number;
      let barColor = 'bg-green-500';
      if (capacity >= 90) barColor = 'bg-red-500';
      else if (capacity >= 70) barColor = 'bg-orange-500';

      return (
        <div className="flex w-[120px] flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] font-medium">
            <span>{capacity}% Terpakai</span>
          </div>
          <Progress value={capacity} className={`h-1.5 [&>div]:${barColor}`} />
        </div>
      );
    },
  },
  {
    accessorKey: 'totalItems',
    header: 'Total Barang',
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.getValue('totalItems')} SKU</span>
    ),
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
            | 'success'
            | 'warning'
            | 'destructive'
            | 'outline'
            | 'default'
            | 'secondary'
            | 'info';
        }
      > = {
        active: { label: 'Aktif', variant: 'success' },
        full: { label: 'Penuh', variant: 'destructive' },
        maintenance: { label: 'Perbaikan', variant: 'warning' },
        inactive: { label: 'Nonaktif', variant: 'outline' },
      };
      const item = config[status] || { label: status, variant: 'outline' };
      return <Badge variant={item.variant}>{item.label}</Badge>;
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
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Gudang
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Gudang
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
