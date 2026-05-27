'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Supplier } from './types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export const columns: ColumnDef<Supplier>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Supplier',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-semibold text-sm text-slate-900">{row.getValue('name')}</span>
        <span className="text-xs text-slate-500 mt-0.5">{row.original.category}</span>
      </div>
    ),
  },
  {
    accessorKey: 'contactPerson',
    header: 'Kontak Person',
    cell: ({ row }) => (
      <span className="text-sm text-slate-700">{row.getValue('contactPerson')}</span>
    ),
  },
  {
    accessorKey: 'location',
    header: 'Lokasi',
    cell: ({ row }) => <span className="text-sm text-slate-600">{row.getValue('location')}</span>,
  },
  {
    accessorKey: 'totalOrders',
    header: 'Total Order',
    cell: ({ row }) => (
      <span className="text-sm text-slate-800 font-medium">
        {row.getValue('totalOrders')} Transaksi
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      if (status === 'active') {
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Aktif
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Nonaktif
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const supplier = row.original;
      return (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="outline"
            size="icon-xs"
            className="cursor-pointer border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50"
            onClick={() =>
              toast.success(`Menghubungi ${supplier.contactPerson} di nomor ${supplier.phone}...`)
            }
            title="Hubungi Telepon"
          >
            <Phone className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-xs"
            className="cursor-pointer border-slate-200 text-slate-600 hover:text-orange-600 hover:bg-slate-50"
            onClick={() => toast.success(`Membuka form email ke ${supplier.email}...`)}
            title="Kirim Email"
          >
            <Mail className="h-3.5 w-3.5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                <span className="sr-only">Buka menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer text-sm"
                onClick={() => toast.info(`Membuka profil supplier: ${supplier.name}`)}
              >
                <Eye className="mr-2 h-4 w-4 text-slate-500" />
                Lihat Profil
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer text-sm"
                onClick={() => toast.info(`Ubah data supplier: ${supplier.name}`)}
              >
                <Edit className="mr-2 h-4 w-4 text-slate-500" />
                Edit Supplier
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive text-sm"
                onClick={() => toast.error(`Hapus supplier: ${supplier.name}`)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Supplier
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
