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
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  FolderUp,
  MoreHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const data: Order[] = [
  {
    id: "1083",
    customer: "Marvin Dekidis",
    product: "Kemeja Batik Slim Fit",
    qty: 2,
    amount: 345000,
    paymentMethod: "E-Wallet",
    status: "new order",
  },
  {
    id: "1082",
    customer: "Carter Lipshitz",
    product: "Celana Chino Premium",
    qty: 6,
    amount: 605000,
    paymentMethod: "Transfer Bank",
    status: "in progress",
  },
  {
    id: "1081",
    customer: "Addison Philips",
    product: "Sepatu Kulit Formal",
    qty: 3,
    amount: 475000,
    paymentMethod: "E-Wallet",
    status: "new order",
  },
  {
    id: "1079",
    customer: "Craig Siphron",
    product: "Tas Selempang Canvas",
    qty: 15,
    amount: 898000,
    paymentMethod: "Transfer Bank",
    status: "on hold",
  },
  {
    id: "1078",
    customer: "Emma Johnson",
    product: "Jaket Bomber Pria",
    qty: 4,
    amount: 1207500,
    paymentMethod: "Kartu Kredit",
    status: "completed",
  },
  {
    id: "1077",
    customer: "Michael Smith",
    product: "Kemeja Batik Slim Fit",
    qty: 8,
    amount: 2105000,
    paymentMethod: "Dompet Digital",
    status: "completed",
  },
];

export type Order = {
  id: string;
  customer: string;
  product: string;
  qty: number;
  amount: number;
  paymentMethod: string;
  status: "new order" | "in progress" | "on hold" | "completed";
};

const statusConfig: Record<
  Order["status"],
  { label: string; className: string }
> = {
  "new order": { label: "New Order", className: "bg-blue-100 text-blue-700" },
  "in progress": {
    label: "In Progress",
    className: "bg-yellow-100 text-yellow-700",
  },
  "on hold": { label: "On Hold", className: "bg-orange-100 text-orange-700" },
  completed: {
    label: "Completed",
    className: "bg-emerald-100 text-emerald-700",
  },
};

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="text-sm font-mono text-muted-foreground">
        {row.getValue("id")}
      </span>
    ),
  },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Nama Pelanggan
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-center text-sm font-medium">
        {row.getValue("customer")}
      </div>
    ),
  },
  {
    accessorKey: "product",
    header: "Produk",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("product")}
      </span>
    ),
  },
  {
    accessorKey: "qty",
    header: () => <div className="text-center">Jumlah Barang</div>,
    cell: ({ row }) => (
      <div className="text-center text-sm text-muted-foreground">
        {row.getValue("qty")} Barang
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <div className="text-right w-full">Total Harga</div>
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const formatted = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(row.getValue("amount") as number);
      return (
        <div className="text-center font-medium tabular-nums">{formatted}</div>
      );
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Metode Pembayaran",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.getValue("paymentMethod")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];
      const { label, className } = statusConfig[status];
      return (
        <span
          className={`text-xs px-2 py-1 rounded-md font-medium ${className}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-xs">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Aksi</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(order.id)}
              >
                Salin ID pesanan
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
              <DropdownMenuItem>Lihat detail pesanan</DropdownMenuItem>
              <DropdownMenuItem>Hubungi pelanggan</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function TrackOrderStatus() {
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lacak Status Pesanan</CardTitle>
            <CardDescription>
              Analisis pertumbuhan dan perubahan pola pengunjung
            </CardDescription>
          </div>
          <Button>
            <FolderUp className="mr-1.5 h-4 w-4" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-3 pt-2">
          {[
            {
              label: "New Order",
              value: 43,
              change: 0.5,
              trend: "up",
              progress: 43,
              barColor: "[&>div]:bg-blue-500",
            },
            {
              label: "On Progress",
              value: 12,
              change: 0.3,
              trend: "down",
              progress: 25,
              barColor: "[&>div]:bg-emerald-500",
            },
            {
              label: "Completed",
              value: 40,
              change: 0.5,
              trend: "up",
              progress: 82,
              barColor: "[&>div]:bg-green-400",
            },
            {
              label: "Return",
              value: 2,
              change: 0.5,
              trend: "down",
              progress: 5,
              barColor: "[&>div]:bg-orange-400",
            },
          ].map(({ label, value, change, trend, progress, barColor }) => (
            <div key={label} className="space-y-1.5">
              <p className="text-2xl font-medium">{value}</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{label}</span>
                {trend === "up" ? (
                  <ArrowUp className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs font-medium ${trend === "up" ? "text-emerald-500" : "text-red-500"}`}
                >
                  {change}%
                </span>
              </div>
              <Progress value={progress} className={`h-1.5 ${barColor}`} />
            </div>
          ))}
        </div>

        <div className="flex items-center pt-2">
          <Input
            placeholder="Cari pelanggan..."
            value={
              (table.getColumn("customer")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table.getColumn("customer")?.setFilterValue(e.target.value)
            }
            className="max-w-sm rounded-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} pesanan
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
