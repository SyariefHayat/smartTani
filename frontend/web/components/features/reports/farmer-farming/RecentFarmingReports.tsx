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
import {
  Eye,
  Download,
  MoreHorizontal,
  FileText,
  CalendarDays,
  Map,
  Sprout,
  BarChart4,
  Award,
  Info,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HarvestRecord } from '@/services/harvest';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { toast } from 'sonner';

import * as React from 'react';

interface RecentFarmingReportsProps {
  data: HarvestRecord[];
}

export function RecentFarmingReports({ data }: RecentFarmingReportsProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedHarvest, setSelectedHarvest] = React.useState<HarvestRecord | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const pageSize = 10;
  const totalRows = data.length;
  const totalPages = Math.ceil(totalRows / pageSize);

  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toRow = Math.min(currentPage * pageSize, totalRows);

  const paginatedData = React.useMemo(() => {
    return data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  }, [data, currentPage, pageSize]);

  const [prevData, setPrevData] = React.useState(data);

  if (data !== prevData) {
    setPrevData(data);
    setCurrentPage(1);
  }

  const getHealthScore = (grade: 'A' | 'B' | 'C') => {
    if (grade === 'A')
      return {
        value: 95,
        text: '95/100 (Sangat Baik)',
        color: 'bg-green-500',
        textColor: 'text-green-600 bg-green-50 border-green-200',
      };
    if (grade === 'B')
      return {
        value: 80,
        text: '80/100 (Baik)',
        color: 'bg-blue-500',
        textColor: 'text-blue-600 bg-blue-50 border-blue-200',
      };
    return {
      value: 65,
      text: '65/100 (Cukup)',
      color: 'bg-amber-500',
      textColor: 'text-amber-600 bg-amber-50 border-amber-200',
    };
  };

  const handleDownloadReport = (harvest: HarvestRecord) => {
    const harvestDate = new Date(harvest.harvest_date);
    const dateFormatted = format(harvestDate, 'dd MMMM yyyy', { locale: id });
    const health = getHealthScore(harvest.quality_grade);
    const landName = harvest.land?.name || `Lahan #${harvest.land_id.slice(-4)}`;

    const content = `==================================================
              SMARTTANI AGRICULTURAL PLATFORM
                 LAPORAN HASIL PANEN RESMI
==================================================

ID Laporan      : #${harvest.id.toUpperCase()}
Tanggal Panen   : ${dateFormatted}
Komoditas       : ${harvest.crop_name}
Hasil Panen     : ${harvest.quantity} ${harvest.unit}
Kategori Mutu   : Grade ${harvest.quality_grade}
Skor Kesehatan  : ${health.text}

INFORMASI LAHAN PERTANIAN:
--------------------------------------------------
Nama Lahan      : ${landName}
ID Lahan        : ${harvest.land_id}
Farmer ID       : ${harvest.farmer_id}

CATATAN / KONDISI LAPANGAN:
--------------------------------------------------
${harvest.notes || 'Tidak ada catatan tambahan lapangan.'}

==================================================
Dokumen ini dibuat otomatis oleh Sistem SmartTani.
Dicetak pada    : ${format(new Date(), 'dd MMMM yyyy HH:mm:ss', { locale: id })}
==================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Laporan_Panen_${harvest.crop_name.replace(/\s+/g, '_')}_${harvest.id.slice(-6).toUpperCase()}.txt`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Laporan panen berhasil diunduh sebagai file dokumen!');
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
      <div>
        {totalRows === 0 ? (
          <div className="flex h-[200px] flex-col items-center justify-center text-sm text-slate-400 bg-white">
            Belum ada rekaman hasil panen tercatat.
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="font-semibold text-slate-700 text-xs py-3.5">
                  ID Laporan
                </TableHead>
                <TableHead className="font-semibold text-slate-700 text-xs">Tanggal</TableHead>
                <TableHead className="font-semibold text-slate-700 text-xs">Lahan</TableHead>
                <TableHead className="font-semibold text-slate-700 text-xs">Komoditas</TableHead>
                <TableHead className="font-semibold text-slate-700 text-xs">Hasil Panen</TableHead>
                <TableHead className="font-semibold text-slate-700 text-xs">Kesehatan</TableHead>
                <TableHead className="font-semibold text-slate-700 text-xs">Status</TableHead>
                <TableHead className="font-semibold text-slate-700 text-xs text-right pr-6">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((harvest) => {
                const health = getHealthScore(harvest.quality_grade);
                const harvestDate = new Date(harvest.harvest_date);

                return (
                  <TableRow key={harvest.id} className="hover:bg-slate-50 transition-colors">
                    <TableCell className="font-mono text-xs text-slate-500 py-3.5">
                      #{harvest.id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="text-xs text-slate-600">
                      {format(harvestDate, 'dd MMM yyyy', { locale: id })}
                    </TableCell>
                    <TableCell className="text-xs font-semibold text-slate-800">
                      {harvest.land?.name || `Lahan #${harvest.land_id.slice(-4)}`}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-slate-600">
                      {harvest.crop_name}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-slate-900">
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
                        <span className="text-slate-700 font-medium text-[11px]">
                          {health.value}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="success"
                        className="h-5 text-[9px] font-bold uppercase tracking-wider px-2 border-green-200 text-green-700 bg-green-50"
                      >
                        Final
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-slate-100 cursor-pointer"
                          >
                            <MoreHorizontal className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white border border-slate-200 shadow-md rounded-lg"
                        >
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedHarvest(harvest);
                              setIsDetailOpen(true);
                            }}
                            className="cursor-pointer text-xs font-medium text-slate-700 focus:bg-slate-50 focus:text-slate-950 gap-2"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" /> Detail Laporan
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDownloadReport(harvest)}
                            className="cursor-pointer text-xs font-medium text-slate-700 focus:bg-slate-50 focus:text-slate-950 gap-2"
                          >
                            <Download className="h-3.5 w-3.5 text-slate-500" /> Download Dokumen
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

      {/* Pagination footer */}
      <div className="flex items-center justify-between gap-4 pt-4 pb-4 px-6 border-t border-slate-150 bg-slate-50/50">
        <div className="text-xs text-slate-500 font-medium">
          {totalRows === 0 ? (
            '0 laporan ditemukan'
          ) : (
            <>
              Menampilkan{' '}
              <span className="font-semibold text-slate-800">
                {fromRow}–{toRow}
              </span>{' '}
              dari <span className="font-semibold text-slate-800">{totalRows}</span> laporan panen
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1 || totalPages === 0}
            className="cursor-pointer text-slate-700 bg-white border-slate-200 text-xs font-semibold hover:bg-slate-50 h-8 shadow-2xs hover:border-slate-300"
          >
            Sebelumnya
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="cursor-pointer text-slate-700 bg-white border-slate-200 text-xs font-semibold hover:bg-slate-50 h-8 shadow-2xs hover:border-slate-300"
          >
            Berikutnya
          </Button>
        </div>
      </div>

      {/* Detail Dialog */}
      {selectedHarvest && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl text-slate-900 overflow-x-hidden bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2 text-slate-850">
                <Info className="h-5 w-5 text-blue-500" />
                Detail Catatan Hasil Panen
              </DialogTitle>
              <DialogDescription className="mt-1">ID Panen: {selectedHarvest.id}</DialogDescription>
            </DialogHeader>

            {/* Details Grid */}
            <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 space-y-6 pt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
                  <Map className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Asal Lahan / Blok Tani</p>
                    <p className="font-bold text-base mt-0.5 text-slate-800">
                      {selectedHarvest.land?.name || `Lahan #${selectedHarvest.land_id.slice(-4)}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <Sprout className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Komoditas Tanaman</p>
                    <p className="font-semibold text-sm mt-0.5 text-slate-800">
                      {selectedHarvest.crop_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <CalendarDays className="h-4.5 w-4.5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Tanggal Panen</p>
                    <p className="font-semibold text-sm mt-0.5 text-slate-800">
                      {format(new Date(selectedHarvest.harvest_date), 'dd MMMM yyyy', {
                        locale: id,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <BarChart4 className="h-4.5 w-4.5 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Hasil Produksi</p>
                    <p className="font-bold text-sm mt-0.5 text-green-600">
                      {selectedHarvest.quantity} {selectedHarvest.unit}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <Award className="h-4.5 w-4.5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      Kualitas Klasifikasi (Grade)
                    </p>
                    <div className="mt-1">
                      {selectedHarvest.quality_grade === 'A' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Grade A (Sangat Baik)
                        </span>
                      ) : selectedHarvest.quality_grade === 'B' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          Grade B (Baik)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Grade C (Cukup)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedHarvest.notes && (
                <div className="rounded-lg border border-slate-150 p-4 bg-slate-50/30 flex gap-2.5">
                  <FileText className="h-5 w-5 text-slate-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-500">Catatan Khusus</p>
                    <p className="text-sm leading-relaxed text-slate-750 mt-1 whitespace-pre-wrap">
                      {selectedHarvest.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                className="cursor-pointer font-semibold text-slate-700 text-xs"
                onClick={() => setIsDetailOpen(false)}
              >
                Tutup
              </Button>
              <Button
                className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-semibold text-xs flex items-center gap-1.5"
                onClick={() => {
                  handleDownloadReport(selectedHarvest);
                  setIsDetailOpen(false);
                }}
              >
                <Download className="h-4 w-4" /> Download Dokumen
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
