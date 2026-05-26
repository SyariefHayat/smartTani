'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product, ProductTableActions } from './types';

const PackageIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16.5 9.4 7.5 4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.29 7 12 12 20.71 7" />
    <line x1="12" y1="22" x2="12" y2="12" />
  </svg>
);

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Aktif
        </span>
      );
    case 'Out Of Stock':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
          Stok Habis
        </span>
      );
    case 'Nonaktif':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Nonaktif
        </span>
      );
    case 'Draft':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Draft
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {status}
        </span>
      );
  }
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Nama Produk',
    cell: ({ row }) => (
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
          {row.original.image && !row.original.image.includes('placeholder.jpg') ? (
            <Image
              src={row.original.image}
              alt={row.getValue('name')}
              width={40}
              height={40}
              unoptimized
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          ) : (
            <PackageIcon className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="truncate font-semibold text-slate-900 text-sm leading-snug">
            {row.getValue('name')}
          </span>
          <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase mt-0.5">
            {row.original.sku}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Harga
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return (
        <div className="font-semibold text-slate-900 text-sm tabular-nums">
          {price.toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: 'Kategori',
    cell: ({ row }) => (
      <div className="text-slate-600 text-sm font-medium">{row.getValue('category')}</div>
    ),
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Stok
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-slate-700 text-sm font-semibold">
        {row.getValue('stock')}{' '}
        <span className="text-slate-400 font-normal text-xs ml-0.5">{row.original.unit}</span>
      </div>
    ),
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-sm font-semibold hover:bg-slate-100 cursor-pointer text-slate-700"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Rating
        <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
        <span className="text-sm font-semibold text-slate-700 tabular-nums">
          {row.getValue('rating')}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
  },
  {
    id: 'actions',
    accessorKey: 'Aksi',
    enableHiding: false,
    cell: function ActionsCell({ row, table }) {
      const product = row.original;
      const meta = table.options.meta as ProductTableActions | undefined;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs" className="cursor-pointer">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild className="cursor-pointer text-sm">
              <Link href={`/dashboard/farmer/products/${product.id}`}>
                <Eye className="mr-2 h-4 w-4 text-slate-500" /> Detail
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer text-sm"
              onClick={() => meta?.onEdit(product)}
            >
              <Edit className="mr-2 h-4 w-4 text-slate-500" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive text-sm"
              onClick={() => meta?.onDelete(product)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
