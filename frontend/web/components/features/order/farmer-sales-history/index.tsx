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

import { SalesHistoryHeader } from './SalesHistoryHeader';
import { SalesHistoryStats } from './SalesHistoryStats';
import { SalesHistoryFilters } from './SalesHistoryFilters';
import { SalesHistoryTable } from './SalesHistoryTable';
import { columns } from './columns';
import { FarmerOrder } from '../farmer-orders/types';

const MOCK_SALES: FarmerOrder[] = [
  {
    id: 'ORD-20240428-001',
    customerName: 'Budi Santoso',
    date: '2024-04-28T08:30:00Z',
    totalAmount: 1250000,
    paymentMethod: 'Transfer Bank',
    status: 'delivered',
    items: [{ id: '1', name: 'Pupuk NPK', quantity: 10, price: 125000, image: '' }],
  },
  {
    id: 'ORD-20240425-002',
    customerName: 'Siti Aminah',
    date: '2024-04-25T09:15:00Z',
    totalAmount: 750000,
    paymentMethod: 'E-Wallet',
    status: 'delivered',
    items: [{ id: '2', name: 'Benih Padi', quantity: 5, price: 150000, image: '' }],
  },
  {
    id: 'ORD-20240420-003',
    customerName: 'Ahmad Fauzi',
    date: '2024-04-20T10:45:00Z',
    totalAmount: 2100000,
    paymentMethod: 'Transfer Bank',
    status: 'cancelled',
    items: [{ id: '3', name: 'Alat Semprot', quantity: 2, price: 1050000, image: '' }],
  },
  {
    id: 'ORD-20240415-015',
    customerName: 'Dewi Lestari',
    date: '2024-04-15T14:20:00Z',
    totalAmount: 450000,
    paymentMethod: 'COD',
    status: 'delivered',
    items: [{ id: '4', name: 'Cangkul Baja', quantity: 3, price: 150000, image: '' }],
  },
  {
    id: 'ORD-20240410-009',
    customerName: 'Hendra Wijaya',
    date: '2024-04-10T11:20:00Z',
    totalAmount: 3200000,
    paymentMethod: 'Transfer Bank',
    status: 'delivered',
    items: [{ id: '5', name: 'Traktor Tangan', quantity: 1, price: 3200000, image: '' }],
  },
  {
    id: 'ORD-20240405-012',
    customerName: 'Ani Maryani',
    date: '2024-04-05T15:45:00Z',
    totalAmount: 150000,
    paymentMethod: 'E-Wallet',
    status: 'refunded',
    items: [{ id: '6', name: 'Gunting Stek', quantity: 2, price: 75000, image: '' }],
  },
];

export function FarmerSalesHistory() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_SALES,
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
      <div className="mx-auto flex w-full flex-col gap-8">
        <SalesHistoryHeader />
        <SalesHistoryStats orders={MOCK_SALES} />
        <div className="space-y-6">
          <SalesHistoryFilters table={table} />
          <SalesHistoryTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
