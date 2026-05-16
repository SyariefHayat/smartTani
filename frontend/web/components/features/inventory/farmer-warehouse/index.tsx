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

import { WarehouseHeader } from './WarehouseHeader';
import { WarehouseStats } from './WarehouseStats';
import { WarehouseFilters } from './WarehouseFilters';
import { WarehouseTable } from './WarehouseTable';
import { columns } from './columns';
import { Warehouse } from './types';

const MOCK_WAREHOUSES: Warehouse[] = [
  {
    id: 'WHS-001',
    name: 'Gudang Pusat Utama',
    location: 'Sidoarjo, Jawa Timur',
    type: 'Dry Storage',
    capacity: 75,
    totalItems: 120,
    lastUpdate: '2024-05-15T08:00:00Z',
    status: 'active',
  },
  {
    id: 'WHS-002',
    name: 'Cold Storage A1',
    location: 'Surabaya, Jawa Timur',
    type: 'Cold Storage',
    capacity: 92,
    totalItems: 45,
    lastUpdate: '2024-05-16T09:30:00Z',
    status: 'active',
  },
  {
    id: 'WHS-003',
    name: 'Silo Jagung Utara',
    location: 'Mojokerto, Jawa Timur',
    type: 'Silo',
    capacity: 30,
    totalItems: 15,
    lastUpdate: '2024-05-14T14:20:00Z',
    status: 'active',
  },
  {
    id: 'WHS-004',
    name: 'Gudang Pupuk Barat',
    location: 'Gresik, Jawa Timur',
    type: 'Dry Storage',
    capacity: 100,
    totalItems: 200,
    lastUpdate: '2024-05-10T11:00:00Z',
    status: 'full',
  },
  {
    id: 'WHS-005',
    name: 'Storage Pendingin B2',
    location: 'Malang, Jawa Timur',
    type: 'Cold Storage',
    capacity: 0,
    totalItems: 0,
    lastUpdate: '2024-05-01T16:00:00Z',
    status: 'maintenance',
  },
];

export function FarmerWarehouseManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_WAREHOUSES,
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
        <WarehouseHeader />
        <WarehouseStats warehouses={MOCK_WAREHOUSES} />
        <div className="space-y-4">
          <WarehouseFilters table={table} />
          <WarehouseTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
