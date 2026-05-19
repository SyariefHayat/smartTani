'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Plus,
  Search,
  TrendingUp,
  Wallet,
  Clock,
  CheckCircle2,
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth';
import { investmentService, Proposal } from '@/services/investment';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export function FarmerInvestmentList() {
  const user = useAuthStore((s) => s.user);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'farmer-proposals',
      user?.id,
      pagination.pageIndex,
      pagination.pageSize,
      columnFilters,
    ],
    queryFn: async () => {
      if (!user?.id) return null;

      // In real backend, we filter by farmer_id
      return investmentService.getProposals({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        // Backend should handle farmer_id from token or params
      });
    },
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(
        'Gagal mengambil data proposal: ' +
          (error instanceof Error ? error.message : 'Terjadi kesalahan')
      );
    }
  }, [isError, error]);

  const proposals = React.useMemo(() => data?.data?.proposals || [], [data]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Menunggu Review</Badge>
        );
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Draft</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Disetujui</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Ditolak</Badge>;
      case 'open_for_funding':
        return (
          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
            Pendanaan Dibuka
          </Badge>
        );
      case 'funded':
        return (
          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Terpendanai</Badge>
        );
      case 'completed':
        return <Badge className="bg-green-600 text-white hover:bg-green-600">Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: 'title',
      header: 'Judul Proposal',
      cell: ({ row }) => (
        <div className="font-medium max-w-[250px] truncate" title={row.getValue('title')}>
          {row.getValue('title')}
        </div>
      ),
    },
    {
      accessorKey: 'funding_needed',
      header: 'Dana Dibutuhkan',
      cell: ({ row }) => <div>{formatCurrency(row.getValue('funding_needed'))}</div>,
    },
    {
      accessorKey: 'funding_raised',
      header: 'Terkumpul',
      cell: ({ row }) => {
        const raised = row.original.funding_raised;
        const needed = row.original.funding_needed;
        const percent = Math.min(Math.round((raised / needed) * 100), 100);
        return (
          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-[10px] font-medium">
              <span>{formatCurrency(raised)}</span>
              <span>{percent}%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-green-500 h-full transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'projected_roi_percent',
      header: 'ROI (%)',
      cell: ({ row }) => (
        <div className="font-semibold text-green-600">{row.getValue('projected_roi_percent')}%</div>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.getValue('status')),
    },
    {
      id: 'actions',
      header: 'Aksi',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/dashboard/proposals/${row.original.id}`}>
              <DropdownMenuItem className="cursor-pointer">
                <Eye className="mr-2 h-4 w-4" /> Detail
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: proposals,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: data?.data?.meta?.totalPages ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const totalProposals = data?.data?.meta?.total ?? 0;
  const fromRow = totalProposals === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
  const toRow = Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalProposals);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Permodalan Saya</h2>
          <p className="text-muted-foreground">
            Kelola dan pantau pengajuan modal usaha tani Anda.
          </p>
        </div>
        <Link href="/dashboard/proposals/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Buat Proposal
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposal</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProposals}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dana Dibutuhkan</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(proposals.reduce((acc, p) => acc + p.funding_needed, 0))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Konfirmasi</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proposals.filter((p) => p.status === 'submitted').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Didanai</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proposals.filter((p) => p.status === 'open_for_funding').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari proposal..."
              value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('title')?.setFilterValue(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-md border bg-white overflow-hidden">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-full animate-pulse bg-slate-100 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : proposals.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-64 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                      <TrendingUp className="mb-2 h-12 w-12 opacity-20" />
                      <p className="font-medium text-slate-500">Belum ada proposal investasi</p>
                      <Link href="/dashboard/proposals/create">
                        <Button variant="link" className="text-green-600">
                          Buat proposal pertama Anda
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Menampilkan {fromRow}–{toRow} dari {totalProposals} proposal.
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage() || isLoading}
            >
              Selanjutnya <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
