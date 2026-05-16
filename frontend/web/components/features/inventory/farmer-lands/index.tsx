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

import { LandHeader } from './LandHeader';
import { LandStats } from './LandStats';
import { LandFilters } from './LandFilters';
import { WarehouseTable } from '../farmer-warehouse/WarehouseTable'; // Reuse Table UI
import { columns } from './columns';
import { FarmerLand } from './types';

const MOCK_LANDS: FarmerLand[] = [
  {
    id: 'LND-001',
    name: 'Sawah Utara Blok A',
    location: 'Sidoarjo, Jawa Timur',
    areaHa: 2.5,
    soilType: 'Aluvial',
    status: 'cultivating',
    activeCrop: {
      name: 'Padi Ciherang',
      plantingDate: '2024-03-01T08:00:00Z',
      estimatedHarvestDate: '2024-06-15T08:00:00Z',
      expectedYield: 5000,
    },
  },
  {
    id: 'LND-002',
    name: 'Kebun Jagung Selatan',
    location: 'Surabaya, Jawa Timur',
    areaHa: 1.2,
    soilType: 'Latosol',
    status: 'harvested',
    activeCrop: {
      name: 'Jagung Hibrida',
      plantingDate: '2024-01-15T08:00:00Z',
      estimatedHarvestDate: '2024-05-10T08:00:00Z',
      expectedYield: 2500,
    },
  },
  {
    id: 'LND-003',
    name: 'Lahan Sayur Blok B',
    location: 'Malang, Jawa Timur',
    areaHa: 0.8,
    soilType: 'Andosol',
    status: 'cultivating',
    activeCrop: {
      name: 'Cabai Keriting',
      plantingDate: '2024-04-10T08:00:00Z',
      estimatedHarvestDate: '2024-07-20T08:00:00Z',
      expectedYield: 800,
    },
  },
  {
    id: 'LND-004',
    name: 'Sawah Timur Blok C',
    location: 'Gresik, Jawa Timur',
    areaHa: 3.0,
    soilType: 'Grumosol',
    status: 'fallow',
  },
  {
    id: 'LND-005',
    name: 'Lahan Persiapan D1',
    location: 'Mojokerto, Jawa Timur',
    areaHa: 1.5,
    soilType: 'Regosol',
    status: 'preparing',
  },
];

export function FarmerLandManagement() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: MOCK_LANDS,
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
        <LandHeader />
        <LandStats lands={MOCK_LANDS} />
        <div className="space-y-4">
          <LandFilters table={table} />
          <WarehouseTable table={table} columnsCount={columns.length} />
        </div>
      </div>
    </div>
  );
}
