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

import { OrderHeader } from './OrderHeader';
import { OrderStats } from './OrderStats';
import { OrderFilters } from './OrderFilters';
import { OrderTable } from './OrderTable';
import { columns } from './columns';
import { FarmerOrder } from './types';

const MOCK_ORDERS: FarmerOrder[] = [
  {
    id: 'ORD-20240501-001',
    customerName: 'Budi Santoso',
    date: '2024-05-01T08:30:00Z',
    totalAmount: 1250000,
    paymentMethod: 'Transfer Bank',
    status: 'paid',
    items: [{ id: '1', name: 'Pupuk NPK', quantity: 10, price: 125000, image: '' }],
  },
  {
    id: 'ORD-20240501-002',
    customerName: 'Siti Aminah',
    date: '2024-05-01T09:15:00Z',
    totalAmount: 750000,
    paymentMethod: 'E-Wallet',
    status: 'confirmed_seller',
    items: [{ id: '2', name: 'Benih Padi', quantity: 5, price: 150000, image: '' }],
  },
  {
    id: 'ORD-20240501-003',
    customerName: 'Ahmad Fauzi',
    date: '2024-05-01T10:45:00Z',
    totalAmount: 2100000,
    paymentMethod: 'Transfer Bank',
    status: 'shipped',
    items: [{ id: '3', name: 'Alat Semprot', quantity: 2, price: 1050000, image: '' }],
  },
  {
    id: 'ORD-20240430-015',
    customerName: 'Dewi Lestari',
    date: '2024-04-30T14:20:00Z',
    totalAmount: 450000,
    paymentMethod: 'COD',
    status: 'delivered',
    items: [{ id: '4', name: 'Cangkul Baja', quantity: 3, price: 150000, image: '' }],
  },
  {
    id: 'ORD-20240430-010',
    customerName: 'Eko Prasetyo',
    date: '2024-04-30T11:00:00Z',
    totalAmount: 180000,
    paymentMethod: 'E-Wallet',
    status: 'cancelled',
    items: [{ id: '5', name: 'Sarung Tangan', quantity: 4, price: 45000, image: '' }],
  },
];

export function FarmerIncomingOrderList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_ORDERS,
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
        <OrderHeader />
        <OrderStats orders={MOCK_ORDERS} />
        <div className="space-y-4">
          <OrderFilters table={table} />
          <OrderTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
