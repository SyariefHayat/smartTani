'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ProductStock } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, History, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';

export const columns: ColumnDef<ProductStock>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Produk',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.getValue('name')}</span>
        <span className="text-xs text-muted-foreground">{row.original.sku}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => <span className="text-sm">{row.getValue('category')}</span>,
  },
  {
    accessorKey: 'quantity',
    header: 'Jumlah Stok',
    cell: ({ row }) => {
      const quantity = row.getValue('quantity') as number;
      const unit = row.original.unit;
      const minStock = row.original.minStock;
      const isLow = quantity <= minStock && quantity > 0;
      const isOut = quantity === 0;

      return (
        <div className="flex flex-col gap-0.5">
          <span
            className={`text-sm font-bold ${isOut ? 'text-red-600' : isLow ? 'text-orange-600' : ''}`}
          >
            {quantity} {unit}
          </span>
          <span className="text-[10px] text-muted-foreground">
            Min. {minStock} {unit}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'warehouse',
    header: 'Lokasi Gudang',
    cell: ({ row }) => <span className="text-sm">{row.getValue('warehouse')}</span>,
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
        'In Stock': { label: 'Tersedia', variant: 'success' },
        'Low Stock': { label: 'Menipis', variant: 'warning' },
        'Out of Stock': { label: 'Habis', variant: 'destructive' },
        Incoming: { label: 'Masuk', variant: 'info' },
        Expired: { label: 'Kadaluwarsa', variant: 'destructive' },
      };
      const item = config[status] || { label: status, variant: 'outline' };
      return <Badge variant={item.variant}>{item.label}</Badge>;
    },
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Update Terakhir',
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {format(new Date(row.getValue('lastUpdated')), 'dd MMM yyyy')}
      </span>
    ),
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
              Update Stok
            </DropdownMenuItem>
            <DropdownMenuItem>
              <History className="mr-2 h-4 w-4" />
              Riwayat Mutasi
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <AlertCircle className="mr-2 h-4 w-4" />
              Laporkan Rusak
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
