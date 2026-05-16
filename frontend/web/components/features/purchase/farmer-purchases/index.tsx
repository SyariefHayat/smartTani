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

import { PurchaseHeader } from './PurchaseHeader';
import { PurchaseStats } from './PurchaseStats';
import { PurchaseFilters } from './PurchaseFilters';
import { PurchaseTable } from './PurchaseTable';
import { columns } from './columns';
import { FarmerPurchase } from './types';

const MOCK_PURCHASES: FarmerPurchase[] = [
  {
    id: 'PRC-20240501-101',
    supplierName: 'Distributor Pupuk Nasional',
    date: '2024-05-01T10:00:00Z',
    totalAmount: 3500000,
    paymentMethod: 'Transfer Bank',
    status: 'pending',
    items: [{ id: '1', name: 'Pupuk Urea 50kg', quantity: 20, price: 175000, image: '' }],
  },
  {
    id: 'PRC-20240428-095',
    supplierName: 'Toko Tani Makmur',
    date: '2024-04-28T14:30:00Z',
    totalAmount: 1200000,
    paymentMethod: 'E-Wallet',
    status: 'shipped',
    items: [{ id: '2', name: 'Benih Jagung Hibrida', quantity: 10, price: 120000, image: '' }],
  },
  {
    id: 'PRC-20240425-088',
    supplierName: 'Grosir Pestisida Jaya',
    date: '2024-04-25T09:15:00Z',
    totalAmount: 850000,
    paymentMethod: 'COD',
    status: 'completed',
    items: [{ id: '3', name: 'Pestisida Organik 1L', quantity: 5, price: 170000, image: '' }],
  },
  {
    id: 'PRC-20240420-072',
    supplierName: 'Logistik Tani Cepat',
    date: '2024-04-20T11:45:00Z',
    totalAmount: 450000,
    paymentMethod: 'Transfer Bank',
    status: 'completed',
    items: [{ id: '4', name: 'Alat Semprot Manual', quantity: 1, price: 450000, image: '' }],
  },
  {
    id: 'PRC-20240415-060',
    supplierName: 'Mitra Bibit Unggul',
    date: '2024-04-15T16:20:00Z',
    totalAmount: 2100000,
    paymentMethod: 'Transfer Bank',
    status: 'cancelled',
    items: [{ id: '5', name: 'Bibit Padi Ciherang', quantity: 15, price: 140000, image: '' }],
  },
];

export function FarmerPurchaseList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_PURCHASES,
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
        <PurchaseHeader />
        <PurchaseStats purchases={MOCK_PURCHASES} />
        <div className="space-y-4">
          <PurchaseFilters table={table} />
          <PurchaseTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
