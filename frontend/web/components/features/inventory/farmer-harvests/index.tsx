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

import { HarvestHeader } from './HarvestHeader';
import { HarvestStats } from './HarvestStats';
import { HarvestFilters } from './HarvestFilters';
import { WarehouseTable } from '../farmer-warehouse/WarehouseTable';
import { columns } from './columns';
import { FarmerHarvest } from './types';

const MOCK_HARVESTS: FarmerHarvest[] = [
  {
    id: 'HRV-001',
    landId: 'LND-001',
    landName: 'Sawah Utara Blok A',
    cropName: 'Padi Ciherang',
    harvestDate: '2024-05-15T08:00:00Z',
    actualYield: 5200,
    expectedYield: 5000,
    unit: 'kg',
    status: 'completed',
    quality: 'A',
  },
  {
    id: 'HRV-002',
    landId: 'LND-002',
    landName: 'Kebun Jagung Selatan',
    cropName: 'Jagung Hibrida',
    harvestDate: '2024-05-10T08:00:00Z',
    actualYield: 2450,
    expectedYield: 2500,
    unit: 'kg',
    status: 'completed',
    quality: 'B',
  },
  {
    id: 'HRV-003',
    landId: 'LND-003',
    landName: 'Lahan Sayur Blok B',
    cropName: 'Cabai Keriting',
    harvestDate: '2024-06-20T08:00:00Z',
    expectedYield: 800,
    unit: 'kg',
    status: 'scheduled',
    quality: 'pending',
  },
  {
    id: 'HRV-004',
    landId: 'LND-001',
    landName: 'Sawah Utara Blok A',
    cropName: 'Padi Ciherang',
    harvestDate: '2024-03-10T08:00:00Z',
    actualYield: 4800,
    expectedYield: 5000,
    unit: 'kg',
    status: 'completed',
    quality: 'B',
  },
  {
    id: 'HRV-005',
    landId: 'LND-004',
    landName: 'Sawah Timur Blok C',
    cropName: 'Kedelai',
    harvestDate: '2024-05-25T08:00:00Z',
    expectedYield: 1500,
    unit: 'kg',
    status: 'scheduled',
    quality: 'pending',
  },
];

export function FarmerHarvestManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_HARVESTS,
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
        <HarvestHeader />
        <HarvestStats harvests={MOCK_HARVESTS} />
        <div className="space-y-4">
          <HarvestFilters table={table} />
          <WarehouseTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
