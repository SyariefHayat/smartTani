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

import { SalesReportHeader } from './SalesReportHeader';
import { SalesReportStats } from './SalesReportStats';
import { SalesReportCharts } from './SalesReportCharts';
import { WarehouseTable } from '../../inventory/farmer-warehouse/WarehouseTable';
import { columns } from './columns';
import { DailySalesData, SalesReportItem, SalesReportSummary } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangeContext } from '@/context/dateRange';
import { DateRange } from 'react-day-picker';
import { subDays } from 'date-fns';

const MOCK_SUMMARY: SalesReportSummary = {
  totalSales: 125450000,
  growth: 12.5,
  avgTransaction: 2450000,
  itemsSold: 1250,
};

const MOCK_DAILY_DATA: DailySalesData[] = Array.from({ length: 30 }).map((_, i) => ({
  date: subDays(new Date(), 29 - i).toISOString(),
  sales: Math.floor(Math.random() * 5000000) + 1000000,
  orders: Math.floor(Math.random() * 10) + 2,
}));

const MOCK_ITEMS: SalesReportItem[] = [
  {
    id: 'ORD-20240501-001',
    date: '2024-05-01T08:30:00Z',
    customerName: 'Budi Santoso',
    productName: 'Pupuk NPK Mutiara',
    quantity: 10,
    price: 125000,
    total: 1250000,
    status: 'completed',
  },
  {
    id: 'ORD-20240501-002',
    date: '2024-05-01T09:15:00Z',
    customerName: 'Siti Aminah',
    productName: 'Benih Padi IR64',
    quantity: 5,
    price: 150000,
    total: 750000,
    status: 'completed',
  },
  {
    id: 'ORD-20240501-003',
    date: '2024-05-01T10:45:00Z',
    customerName: 'Ahmad Fauzi',
    productName: 'Alat Semprot Elektrik',
    quantity: 2,
    price: 1050000,
    total: 2100000,
    status: 'completed',
  },
  {
    id: 'ORD-20240430-015',
    date: '2024-04-30T14:20:00Z',
    customerName: 'Dewi Lestari',
    productName: 'Cangkul Baja Modern',
    quantity: 3,
    price: 150000,
    total: 450000,
    status: 'completed',
  },
  {
    id: 'ORD-20240430-010',
    date: '2024-04-30T11:00:00Z',
    customerName: 'Eko Prasetyo',
    productName: 'Sarung Tangan Safety',
    quantity: 4,
    price: 45000,
    total: 180000,
    status: 'cancelled',
  },
];

export function FarmerSalesReport() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_ITEMS,
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
    <DateRangeContext.Provider value={{ date, setDate }}>
      <div className="w-full text-slate-900">
        <div className="mx-auto flex w-full flex-col gap-6">
          <SalesReportHeader />
          <SalesReportStats summary={MOCK_SUMMARY} />

          <SalesReportCharts data={MOCK_DAILY_DATA} />

          <Card className="border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Rincian Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <WarehouseTable table={table} columnsCount={columns.length} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DateRangeContext.Provider>
  );
}
