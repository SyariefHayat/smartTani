'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MOCK_REPORTS = [
  {
    id: 'RPT-001',
    date: '2024-05-15',
    land: 'Lahan Utara Blok A',
    crop: 'Padi Ciherang',
    yield: '5.2 Ton',
    health: '95/100',
    status: 'Final',
  },
  {
    id: 'RPT-002',
    date: '2024-05-12',
    land: 'Lahan Selatan Blok B',
    crop: 'Jagung Hibrida',
    yield: '3.8 Ton',
    health: '88/100',
    status: 'Final',
  },
  {
    id: 'RPT-003',
    date: '2024-05-10',
    land: 'Lahan Barat Blok C',
    crop: 'Cabai Keriting',
    yield: '1.2 Ton',
    health: '82/100',
    status: 'Draft',
  },
  {
    id: 'RPT-004',
    date: '2024-05-05',
    land: 'Lahan Timur Blok D',
    crop: 'Bawang Merah',
    yield: '2.5 Ton',
    health: '90/100',
    status: 'Final',
  },
];

export function RecentFarmingReports() {
  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead>ID Laporan</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Lahan</TableHead>
            <TableHead>Komoditas</TableHead>
            <TableHead>Hasil Panen</TableHead>
            <TableHead>Kesehatan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_REPORTS.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium text-xs">{report.id}</TableCell>
              <TableCell className="text-xs">{report.date}</TableCell>
              <TableCell className="text-xs">{report.land}</TableCell>
              <TableCell className="text-xs">{report.crop}</TableCell>
              <TableCell className="text-xs font-bold">{report.yield}</TableCell>
              <TableCell className="text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: report.health.split('/')[0] + '%' }}
                    />
                  </div>
                  {report.health}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={report.status === 'Final' ? 'success' : 'outline'}
                  className="h-4 text-[10px]"
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" /> Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" /> Download PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
