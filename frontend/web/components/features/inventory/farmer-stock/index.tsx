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

import { StockHeader } from './StockHeader';
import { StockStats } from './StockStats';
import { StockFilters } from './StockFilters';
import { StockTable } from './StockTable';
import { columns } from './columns';
import { ProductStock } from './types';

const MOCK_STOCKS: ProductStock[] = [
  {
    id: 'STK-001',
    name: 'Pupuk NPK Phonska Plus 50kg',
    sku: 'PNK001A',
    category: 'Pupuk',
    quantity: 120,
    unit: 'Karung',
    warehouse: 'Gudang Pusat Utama',
    minStock: 20,
    lastUpdated: '2024-05-15T08:00:00Z',
    status: 'In Stock',
    pricePerUnit: 385000,
  },
  {
    id: 'STK-002',
    name: 'Benih Padi Ciherang Unggul 5kg',
    sku: 'BNC002B',
    category: 'Benih',
    quantity: 15,
    unit: 'Kemasan',
    warehouse: 'Gudang Pusat Utama',
    minStock: 25,
    lastUpdated: '2024-05-16T09:30:00Z',
    status: 'Low Stock',
    pricePerUnit: 75000,
  },
  {
    id: 'STK-003',
    name: 'Pestisida Dursban 200EC 1 Liter',
    sku: 'PST003C',
    category: 'Pestisida',
    quantity: 0,
    unit: 'Botol',
    warehouse: 'Gudang Pupuk Barat',
    minStock: 10,
    lastUpdated: '2024-05-14T14:20:00Z',
    status: 'Out of Stock',
    pricePerUnit: 125000,
  },
  {
    id: 'STK-004',
    name: 'Gabah Kering Giling (GKG)',
    sku: 'GAB004D',
    category: 'Hasil Panen',
    quantity: 2500,
    unit: 'kg',
    warehouse: 'Silo Jagung Utara',
    minStock: 500,
    lastUpdated: '2024-05-10T11:00:00Z',
    status: 'In Stock',
    pricePerUnit: 7200,
  },
  {
    id: 'STK-005',
    name: 'Pupuk Urea Granul Petrokimia 50kg',
    sku: 'PUG005E',
    category: 'Pupuk',
    quantity: 45,
    unit: 'Karung',
    warehouse: 'Gudang Pupuk Barat',
    minStock: 15,
    lastUpdated: '2024-05-01T16:00:00Z',
    status: 'In Stock',
    pricePerUnit: 310000,
  },
  {
    id: 'STK-006',
    name: 'Benih Jagung Hibrida P27 1kg',
    sku: 'BJH006F',
    category: 'Benih',
    quantity: 5,
    unit: 'Kemasan',
    warehouse: 'Cold Storage A1',
    minStock: 20,
    lastUpdated: '2024-05-12T10:00:00Z',
    status: 'Low Stock',
    pricePerUnit: 95000,
  },
  {
    id: 'STK-007',
    name: 'Fungisida Antracol 70WP 500gr',
    sku: 'FNG007G',
    category: 'Pestisida',
    quantity: 30,
    unit: 'Kemasan',
    warehouse: 'Gudang Pusat Utama',
    minStock: 5,
    lastUpdated: '2024-05-15T12:00:00Z',
    status: 'In Stock',
    pricePerUnit: 89000,
  },
];

export function FarmerStockManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_STOCKS,
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
        <StockHeader />
        <StockStats stocks={MOCK_STOCKS} />
        <div className="space-y-4">
          <StockFilters table={table} />
          <StockTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
