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

import { TransactionHeader } from './TransactionHeader';
import { TransactionStats } from './TransactionStats';
import { TransactionFilters } from './TransactionFilters';
import { TransactionTable } from './TransactionTable';
import { columns } from './columns';
import { Transaction } from './types';

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-001',
    date: '2024-05-16T10:30:00Z',
    description: 'Penjualan Hasil Panen Gabah Kering',
    type: 'Income',
    category: 'Penjualan',
    amount: 15400000,
    status: 'Completed',
    paymentMethod: 'Transfer Bank',
    referenceId: 'ORD-12345',
  },
  {
    id: 'TRX-002',
    date: '2024-05-15T14:20:00Z',
    description: 'Pembelian Pupuk NPK Phonska (10 Karung)',
    type: 'Expense',
    category: 'Sarana Produksi',
    amount: 3850000,
    status: 'Completed',
    paymentMethod: 'Saldo SmartTani',
    referenceId: 'PUR-67890',
  },
  {
    id: 'TRX-003',
    date: '2024-05-14T09:00:00Z',
    description: 'Penarikan Saldo Ke Bank BCA',
    type: 'Withdrawal',
    category: 'Pribadi',
    amount: 5000000,
    status: 'Completed',
    paymentMethod: 'Transfer Bank',
    referenceId: 'WD-99881',
  },
  {
    id: 'TRX-004',
    date: '2024-05-13T11:00:00Z',
    description: 'Bonus Referral Member Baru',
    type: 'Income',
    category: 'Lainnya',
    amount: 50000,
    status: 'Completed',
    paymentMethod: 'Saldo SmartTani',
    referenceId: 'REF-77221',
  },
  {
    id: 'TRX-005',
    date: '2024-05-12T16:45:00Z',
    description: 'Top Up Saldo via Mandiri Virtual Account',
    type: 'TopUp',
    category: 'Top Up',
    amount: 1000000,
    status: 'Completed',
    paymentMethod: 'VA Mandiri',
    referenceId: 'TOP-11223',
  },
  {
    id: 'TRX-006',
    date: '2024-05-11T13:10:00Z',
    description: 'Pembayaran Ongkos Kirim Logistik',
    type: 'Expense',
    category: 'Logistik',
    amount: 150000,
    status: 'Completed',
    paymentMethod: 'Saldo SmartTani',
    referenceId: 'SHIP-55443',
  },
  {
    id: 'TRX-007',
    date: '2024-05-10T08:20:00Z',
    description: 'Penjualan Benih Padi Ciherang',
    type: 'Income',
    category: 'Penjualan',
    amount: 2250000,
    status: 'Pending',
    paymentMethod: 'Transfer Bank',
    referenceId: 'ORD-12346',
  },
];

export function TransactionHistoryManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: MOCK_TRANSACTIONS,
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
        <TransactionHeader />
        <TransactionStats transactions={MOCK_TRANSACTIONS} />
        <div className="space-y-4">
          <TransactionFilters table={table} />
          <TransactionTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
