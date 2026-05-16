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

import { ProductStats } from './product-list/ProductStats';
import { ProductHeader } from './product-list/ProductHeader';
import { ProductFilters } from './product-list/ProductFilters';
import { ProductTable } from './product-list/ProductTable';
import { columns } from './product-list/columns';
import { Product } from './product-list/types';

// Mock data updated to match public/table.png
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Pupuk NPK Phonska Plus 50kg',
    sku: 'PNK001A',
    category: 'Pupuk',
    price: 385000,
    stock: 120,
    unit: 'Karung',
    rating: 4.9,
    status: 'Active',
    image: '/images/products/npk.jpg',
  },
  {
    id: '2',
    name: 'Benih Padi Ciherang Unggul 5kg',
    sku: 'BNC002B',
    category: 'Benih',
    price: 75000,
    stock: 250,
    unit: 'Kemasan',
    rating: 4.8,
    status: 'Active',
    image: '/images/products/padi.jpg',
  },
  {
    id: '3',
    name: 'Pestisida Dursban 200EC 1 Liter',
    sku: 'PST003C',
    category: 'Pupuk',
    price: 125000,
    stock: 0,
    unit: 'Botol',
    rating: 4.5,
    status: 'Out Of Stock',
    image: '/images/products/pestisida.jpg',
  },
  {
    id: '4',
    name: 'Benih Jagung Hibrida Pioneer P27 1kg',
    sku: 'BJH004D',
    category: 'Benih',
    price: 95000,
    stock: 80,
    unit: 'Kemasan',
    rating: 4.7,
    status: 'Active',
    image: '/images/products/jagung.jpg',
  },
  {
    id: '5',
    name: 'Pupuk Urea Granul Petrokimia 50kg',
    sku: 'PUG005E',
    category: 'Pupuk',
    price: 310000,
    stock: 15,
    unit: 'Karung',
    rating: 4.6,
    status: 'Active',
    image: '/images/products/urea.jpg',
  },
  {
    id: '6',
    name: 'Fungisida Antracol 70WP 500gr',
    sku: 'FNG006F',
    category: 'Pupuk',
    price: 89000,
    stock: 0,
    unit: 'Kemasan',
    rating: 4.3,
    status: 'Closed For Sale',
    image: '/images/products/fungisida.jpg',
  },
  {
    id: '7',
    name: 'Benih Cabai Merah Keriting TM 999 10gr',
    sku: 'BCK007G',
    category: 'Benih',
    price: 55000,
    stock: 300,
    unit: 'Kemasan',
    rating: 4.8,
    status: 'Active',
    image: '/images/products/cabai.jpg',
  },
  {
    id: '8',
    name: 'Pupuk Organik Cair NASA 1 Liter',
    sku: 'POC008H',
    category: 'Pupuk',
    price: 65000,
    stock: 45,
    unit: 'Botol',
    rating: 4.4,
    status: 'Active',
    image: '/images/products/nasa.jpg',
  },
];

export function FarmerProductList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    sku: false,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: MOCK_PRODUCTS,
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
      <div className="mx-auto flex w-full flex-col gap-4">
        <ProductHeader />
        <ProductStats products={MOCK_PRODUCTS} />
        <ProductFilters table={table} />
        <ProductTable table={table} columnsCount={columns.length} />
      </div>
    </div>
  );
}
