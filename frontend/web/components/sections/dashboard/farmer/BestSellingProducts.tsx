"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, FolderUp, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type Product = {
  id: string;
  product: string;
  image: string;
  sold: number;
  sales: number;
};

const data: Product[] = [
  {
    id: "PRD-001",
    product: "Kemeja Batik Slim Fit",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=48&h=48&fit=crop",
    sold: 1240,
    sales: 186000000,
  },
  {
    id: "PRD-002",
    product: "Celana Chino Premium",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=48&h=48&fit=crop",
    sold: 980,
    sales: 147000000,
  },
  {
    id: "PRD-003",
    product: "Sepatu Kulit Formal",
    image:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=48&h=48&fit=crop",
    sold: 754,
    sales: 226200000,
  },
  {
    id: "PRD-004",
    product: "Tas Selempang Canvas",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=48&h=48&fit=crop",
    sold: 612,
    sales: 73440000,
  },
  {
    id: "PRD-005",
    product: "Jaket Bomber Pria",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=48&h=48&fit=crop",
    sold: 430,
    sales: 103200000,
  },
  {
    id: "PRD-005",
    product: "Jaket Bomber Pria",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=48&h=48&fit=crop",
    sold: 430,
    sales: 103200000,
  },
];

const statusStyles: Record<string, string> = {
  aktif: "bg-green-100 text-green-700",
  habis: "bg-red-100 text-red-600",
  nonaktif: "bg-gray-100 text-gray-500",
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "product",
    header: "Produk",
    cell: ({ row }) => {
      const image = row.original.image;
      const name = row.getValue("product") as string;
      const id = row.original.id;
      return (
        <div className="flex items-center gap-3">
          <img
            src={image}
            alt={name}
            className="h-10 w-10 rounded-md object-cover border"
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm">{name}</span>
            <span className="text-xs text-muted-foreground">{id}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "sold",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Terjual
        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center tabular-nums">
        {(row.getValue("sold") as number).toLocaleString("id-ID")} pcs
      </div>
    ),
  },
  {
    accessorKey: "sales",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Pendapatan
        <ArrowUpDown className="ml-1 h-3.5 w-3.5" />
      </Button>
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.getValue("sales") as number);
      return (
        <div className="text-right font-medium tabular-nums">{formatted}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(item.id)}
              >
                Salin ID produk
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem>Lihat detail produk</DropdownMenuItem>
              <DropdownMenuItem>Edit produk</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTableDemo({ className }: { className?: string }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
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
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Produk Terlaris</CardTitle>
          <Button>
            <FolderUp className="mr-1.5 h-4 w-4" /> Export
          </Button>
        </div>
        <div className="flex items-center pt-4">
          <Input
            placeholder="Cari produk..."
            value={
              (table.getColumn("product")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("product")?.setFilterValue(e.target.value)
            }
            className="rounded-sm max-w-sm"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada hasil.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} produk ditemukan
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
