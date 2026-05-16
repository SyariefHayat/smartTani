'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

import { SupplierHeader } from './SupplierHeader';
import { SupplierStats } from './SupplierStats';
import { SupplierFilters } from './SupplierFilters';
import { PurchaseTable } from '../farmer-purchases/PurchaseTable'; // Reuse Table UI
import { columns } from './columns';
import { Supplier } from './types';

const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'SUP-001',
    name: 'Distributor Pupuk Nasional',
    category: 'Pupuk',
    contactPerson: 'Agus Setiawan',
    phone: '081234567890',
    email: 'agus@distributorpupuk.com',
    location: 'Surabaya, Jawa Timur',
    totalOrders: 15,
    lastOrderDate: '2024-05-01T10:00:00Z',
    status: 'active',
  },
  {
    id: 'SUP-002',
    name: 'Toko Tani Makmur',
    category: 'Benih',
    contactPerson: 'Siti Rohmah',
    phone: '082123456789',
    email: 'siti@tanimakmur.com',
    location: 'Malang, Jawa Timur',
    totalOrders: 8,
    lastOrderDate: '2024-04-28T14:30:00Z',
    status: 'active',
  },
  {
    id: 'SUP-003',
    name: 'Grosir Pestisida Jaya',
    category: 'Pestisida',
    contactPerson: 'Hendro Wijaya',
    phone: '081333444555',
    email: 'hendro@pestisidajaya.com',
    location: 'Sidoarjo, Jawa Timur',
    totalOrders: 20,
    lastOrderDate: '2024-04-25T09:15:00Z',
    status: 'active',
  },
  {
    id: 'SUP-004',
    name: 'Mitra Bibit Unggul',
    category: 'Benih',
    contactPerson: 'Dewi Lestari',
    phone: '085566778899',
    email: 'dewi@mitrabibit.com',
    location: 'Banyuwangi, Jawa Timur',
    totalOrders: 5,
    lastOrderDate: '2024-04-15T16:20:00Z',
    status: 'active',
  },
  {
    id: 'SUP-005',
    name: 'Teknologi Tani Mandiri',
    category: 'Alat Pertanian',
    contactPerson: 'Bambang Kusuma',
    phone: '081999000111',
    email: 'bambang@tektani.com',
    location: 'Semarang, Jawa Tengah',
    totalOrders: 3,
    lastOrderDate: '2024-03-20T11:45:00Z',
    status: 'inactive',
  },
];

export function FarmerSupplierList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_SUPPLIERS,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <SupplierHeader />
        <SupplierStats suppliers={MOCK_SUPPLIERS} />
        <div className="space-y-4">
          <SupplierFilters table={table} />
          <PurchaseTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
