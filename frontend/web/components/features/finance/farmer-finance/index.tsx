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

import { FinanceHeader } from './FinanceHeader';
import { FinanceStats } from './FinanceStats';
import { WarehouseTable } from '../../inventory/farmer-warehouse/WarehouseTable';
import { columns } from './columns';
import { FarmerTransaction, FinanceSummary } from './types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const MOCK_SUMMARY: FinanceSummary = {
  currentBalance: 8500000,
  totalEarnings: 24500000,
  pendingBalance: 1200000,
  monthlyWithdrawal: 4500000,
};

const MOCK_TRANSACTIONS: FarmerTransaction[] = [
  {
    id: 'TRX-001',
    date: '2024-05-15T08:30:00Z',
    type: 'revenue',
    amount: 1250000,
    description: 'Penjualan Pupuk NPK Mutiara (ORD-20240428-001)',
    status: 'success',
  },
  {
    id: 'TRX-002',
    date: '2024-05-14T14:20:00Z',
    type: 'withdrawal',
    amount: 2000000,
    description: 'Penarikan Dana ke Bank BCA (****1234)',
    status: 'success',
  },
  {
    id: 'TRX-003',
    date: '2024-05-13T10:15:00Z',
    type: 'revenue',
    amount: 750000,
    description: 'Penjualan Benih Padi IR64 (ORD-20240425-002)',
    status: 'success',
  },
  {
    id: 'TRX-004',
    date: '2024-05-12T09:00:00Z',
    type: 'revenue',
    amount: 3200000,
    description: 'Penjualan Traktor Tangan (ORD-20240410-009)',
    status: 'pending',
  },
  {
    id: 'TRX-005',
    date: '2024-05-11T16:45:00Z',
    type: 'withdrawal',
    amount: 1500000,
    description: 'Penarikan Dana ke E-Wallet DANA (0812****)',
    status: 'failed',
  },
];

export function FarmerFinanceManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
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
        <FinanceHeader />
        <FinanceStats summary={MOCK_SUMMARY} />

        <Card className="border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Riwayat Transaksi Terakhir</CardTitle>
          </CardHeader>
          <CardContent>
            <WarehouseTable table={table} columnsCount={columns.length} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
