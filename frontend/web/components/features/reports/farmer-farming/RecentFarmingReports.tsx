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
import { HarvestRecord } from '@/services/harvest';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface RecentFarmingReportsProps {
  data: HarvestRecord[];
}

export function RecentFarmingReports({ data }: RecentFarmingReportsProps) {
  const getHealthScore = (grade: 'A' | 'B' | 'C') => {
    if (grade === 'A') return { value: 95, text: '95/100', color: 'bg-green-500' };
    if (grade === 'B') return { value: 80, text: '80/100', color: 'bg-blue-500' };
    return { value: 65, text: '65/100', color: 'bg-amber-500' };
  };

  return (
    <div className="rounded-md border bg-white overflow-hidden shadow-sm">
      {data.length === 0 ? (
        <div className="flex h-[200px] flex-col items-center justify-center text-sm text-muted-foreground bg-white">
          Belum ada rekaman hasil panen tercatat.
        </div>
      ) : (
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
            {data.map((harvest) => {
              const health = getHealthScore(harvest.quality_grade);
              const harvestDate = new Date(harvest.harvest_date);

              return (
                <TableRow key={harvest.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    #{harvest.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-xs">
                    {format(harvestDate, 'dd MMM yyyy', { locale: id })}
                  </TableCell>
                  <TableCell className="text-xs font-medium">
                    {harvest.land?.name || `Lahan #${harvest.land_id.slice(-4)}`}
                  </TableCell>
                  <TableCell className="text-xs">{harvest.crop_name}</TableCell>
                  <TableCell className="text-xs font-bold">
                    {harvest.quantity} {harvest.unit}
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${health.color}`}
                          style={{ width: `${health.value}%` }}
                        />
                      </div>
                      {health.text}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" className="h-4 text-[10px] uppercase">
                      Final
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
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
