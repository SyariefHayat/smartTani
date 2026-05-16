'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Supplier } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Phone, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Supplier',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium text-sm">{row.getValue('name')}</span>
        <span className="text-xs text-muted-foreground">{row.original.category}</span>
      </div>
    ),
  },
  {
    accessorKey: 'contactPerson',
    header: 'Kontak Person',
    cell: ({ row }) => <span className="text-sm">{row.getValue('contactPerson')}</span>,
  },
  {
    accessorKey: 'location',
    header: 'Lokasi',
    cell: ({ row }) => <span className="text-sm">{row.getValue('location')}</span>,
  },
  {
    accessorKey: 'totalOrders',
    header: 'Total Order',
    cell: ({ row }) => <span className="text-sm">{row.getValue('totalOrders')} Transaksi</span>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'active' ? 'success' : 'outline'}>
          {status === 'active' ? 'Aktif' : 'Nonaktif'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon-xs" title="Telepon">
            <Phone className="h-3.5 w-3.5 text-blue-600" />
          </Button>
          <Button variant="outline" size="icon-xs" title="Email">
            <Mail className="h-3.5 w-3.5 text-orange-600" />
          </Button>
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
                Lihat Profil
              </DropdownMenuItem>
              <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Hapus Supplier</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
