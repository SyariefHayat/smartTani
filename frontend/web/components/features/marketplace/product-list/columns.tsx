'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Edit, Eye, MoreVertical, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Product } from './types';

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
        <Badge className="rounded-full border border-green-200 bg-green-50 px-3 py-0.5 font-medium text-green-600 hover:bg-green-50">
          Active
        </Badge>
      );
    case 'Out Of Stock':
      return (
        <Badge className="rounded-full border border-orange-200 bg-orange-50 px-3 py-0.5 font-medium text-orange-600 hover:bg-orange-50">
          Out Of Stock
        </Badge>
      );
    case 'Closed For Sale':
      return (
        <Badge className="rounded-full border border-red-200 bg-red-50 px-3 py-0.5 font-medium text-red-600 hover:bg-red-50">
          Closed For Sale
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="rounded-full">
          {status}
        </Badge>
      );
  }
};

export const columns: ColumnDef<Product>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 accent-green-600"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && ('indeterminate' as any))
        }
        onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-slate-300 accent-green-600"
        checked={row.getIsSelected()}
        onChange={(e) => row.toggleSelected(!!e.target.checked)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Product Name
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-white">
          <PackageIcon className="h-4 w-4 text-slate-300" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="truncate font-medium text-slate-900 text-sm">
            {row.getValue('name')}
          </span>
          <span className="font-mono text-[10px] text-slate-400">{row.original.sku}</span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'price',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Price
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const price = parseFloat(row.getValue('price'));
      return (
        <div className="font-medium text-slate-900 text-sm">
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Category
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-slate-600 text-sm">{row.getValue('category')}</div>,
  },
  {
    accessorKey: 'stock',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Stock
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => <div className="text-slate-600 text-sm">{row.getValue('stock')}</div>,
  },
  {
    accessorKey: 'rating',
    header: 'Rating',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
        <span className="text-xs font-medium text-slate-700">{row.getValue('rating')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 hover:bg-transparent"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
  },
  {
    id: 'actions',
    accessorKey: 'Aksi',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" /> Detail
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" /> Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
