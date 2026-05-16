'use client';

import { ColumnDef } from '@tanstack/react-table';
import { FarmerLand } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
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
        <span className="font-medium text-sm">{row.getValue('name')}</span>
        <span className="text-xs text-muted-foreground">{row.original.location}</span>
      </div>
    ),
  },
  {
    accessorKey: 'areaHa',
    header: 'Luas',
    cell: ({ row }) => <span className="text-sm">{row.getValue('areaHa')} Ha</span>,
  },
  {
    accessorKey: 'activeCrop',
    header: 'Tanaman Aktif',
    cell: ({ row }) => {
      const crop = row.original.activeCrop;
      if (!crop) return <span className="text-xs text-muted-foreground italic">Kosong</span>;

      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{crop.name}</span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-2.5 w-2.5" />
            <span>
              Panen: {format(new Date(crop.estimatedHarvestDate), 'dd MMM yyyy', { locale: id })}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'soilType',
    header: 'Tipe Tanah',
    cell: ({ row }) => <span className="text-sm">{row.getValue('soilType')}</span>,
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
        cultivating: { label: 'Ditanam', variant: 'success' },
        harvested: { label: 'Panen', variant: 'info' },
        fallow: { label: 'Kosong', variant: 'outline' },
        preparing: { label: 'Persiapan', variant: 'warning' },
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
              Edit Lahan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Hapus Lahan
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
