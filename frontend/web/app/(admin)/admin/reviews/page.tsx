'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService, ReportedReviewItem } from '@/services/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  AlertTriangle,
  Search,
  Trash2,
  CheckCircle,
  MessageSquare,
  Star,
  BookOpen,
  ShoppingBag,
  Clock,
  Filter,
} from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const MOCK_REVIEWS: ReportedReviewItem[] = [
  {
    id: 'rev-1',
    item_type: 'product',
    item_id: 'prod-1',
    item_title: 'Pupuk Organik Super Humus 5kg',
    buyer_name: 'Dewi Lestari',
    rating: 1,
    comment: 'Produk hancur kemasannya rusak parah, seller tidak bertanggung jawab!',
    reported: true,
    report_reason: 'Mengandung kata kasar dan provokatif',
    created_at: '2026-05-27T10:00:00Z',
  },
  {
    id: 'rev-2',
    item_type: 'course',
    item_id: 'crs-3',
    item_title: 'Dasar Pemrograman IoT Pertanian',
    student_name: 'Ahmad Ghozali',
    rating: 2,
    comment: 'Materi sangat membosankan, instruktur membaca slide saja tanpa praktek nyata.',
    reported: true,
    report_reason: 'Spam / Review tidak berbobot',
    created_at: '2026-05-26T14:30:00Z',
  },
  {
    id: 'rev-3',
    item_type: 'product',
    item_id: 'prod-3',
    item_title: 'Bawang Merah Lokal Lamongan 1kg',
    buyer_name: 'Dian Permana',
    rating: 1,
    comment: 'Jangan beli disini!! Penipu, berat timbangan kurang 200 gram!',
    reported: true,
    report_reason: 'Tuduhan palsu / pencemaran nama baik',
    created_at: '2026-05-25T08:15:00Z',
  },
  {
    id: 'rev-4',
    item_type: 'course',
    item_id: 'crs-1',
    item_title: 'Kombinasi Hidroponik & IoT Cerdas',
    student_name: 'Rudi Tabuti',
    rating: 5,
    comment: 'Luar biasa sekali materinya! Sangat bermanfaat untuk pertanian modern.',
    reported: false,
    created_at: '2026-05-24T12:00:00Z',
  },
];

export default function AdminReviewsModerationPage() {
  const queryClient = useQueryClient();
  const [isOffline, setIsOffline] = React.useState(false);
  const [searchVal, setSearchVal] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [ratingFilter, setRatingFilter] = React.useState('all');
  const [page, setPage] = React.useState(1);

  // Initialize localStorage once if not exists
  React.useEffect(() => {
    if (!localStorage.getItem('admin-reviews')) {
      localStorage.setItem('admin-reviews', JSON.stringify(MOCK_REVIEWS));
    }
  }, []);

  // Fetch reviews list query
  const { data, isLoading } = useQuery({
    queryKey: ['admin-reported-reviews', typeFilter, ratingFilter, page, searchVal],
    queryFn: async () => {
      try {
        const res = await adminService.getAllReviews({
          page,
          limit: 10,
          type: typeFilter === 'all' ? undefined : typeFilter,
          rating: ratingFilter === 'all' ? undefined : parseInt(ratingFilter, 10),
          reported_only: true,
        });
        return res;
      } catch {
        setIsOffline(true);
        // Fallback to local storage
        const stored: ReportedReviewItem[] = JSON.parse(
          localStorage.getItem('admin-reviews') || '[]'
        );
        let filtered = stored.filter((r) => r.reported); // Only reported ones

        if (typeFilter !== 'all') {
          filtered = filtered.filter((r) => r.item_type === typeFilter);
        }
        if (ratingFilter !== 'all') {
          filtered = filtered.filter((r) => r.rating === parseInt(ratingFilter, 10));
        }
        if (searchVal) {
          const query = searchVal.toLowerCase();
          filtered = filtered.filter(
            (r) =>
              r.comment.toLowerCase().includes(query) ||
              r.item_title.toLowerCase().includes(query) ||
              (r.buyer_name || '').toLowerCase().includes(query) ||
              (r.student_name || '').toLowerCase().includes(query) ||
              (r.report_reason || '').toLowerCase().includes(query)
          );
        }

        return {
          reviews: filtered.slice((page - 1) * 10, page * 10),
          meta: {
            page,
            limit: 10,
            total: filtered.length,
            totalPages: Math.ceil(filtered.length / 10) || 1,
          },
        };
      }
    },
  });

  // Calculate quick stats from all items in database
  const stats = React.useMemo(() => {
    const stored = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-reviews')) ||
        JSON.stringify(MOCK_REVIEWS)
    );
    const totalReported = stored.filter((r: any) => r.reported).length;
    const productReviews = stored.filter((r: any) => r.item_type === 'product').length;
    const courseReviews = stored.filter((r: any) => r.item_type === 'course').length;
    const criticalOneStar = stored.filter((r: any) => r.rating === 1).length;
    return { totalReported, productReviews, courseReviews, criticalOneStar };
  }, [data]);

  // Delete review mutation (Permanently remove review)
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      await adminService.deleteReview(reviewId);
      // Log action to audit log
      adminService.logAuditAction(
        'DELETE_REVIEW',
        'review',
        reviewId,
        `Menghapus ulasan terlaporkan karena melanggar pedoman komunitas.`
      );
    },
    onSuccess: () => {
      toast.success('Ulasan yang melanggar pedoman berhasil dihapus permanen!');
      queryClient.invalidateQueries({ queryKey: ['admin-reported-reviews'] });
    },
  });

  // Ignore / Dismiss report mutation
  const dismissReportMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      try {
        // Normally calls api patch, but mock handles it here:
        const stored: ReportedReviewItem[] = JSON.parse(
          localStorage.getItem('admin-reviews') || '[]'
        );
        const updated = stored.map((r) => (r.id === reviewId ? { ...r, reported: false } : r));
        localStorage.setItem('admin-reviews', JSON.stringify(updated));

        // Log action to audit log
        adminService.logAuditAction(
          'DISMISS_REVIEW_REPORT',
          'review',
          reviewId,
          `Mengabaikan laporan ulasan, ulasan dinilai aman.`
        );
      } catch (e) {
        // Error fallback
      }
    },
    onSuccess: () => {
      toast.success('Laporan ulasan berhasil diabaikan.');
      queryClient.invalidateQueries({ queryKey: ['admin-reported-reviews'] });
    },
  });

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Moderasi Ulasan 💬</h1>
          <p className="text-xs font-semibold text-slate-500">
            Tinjau ulasan produk & kursus akademi yang dilaporkan oleh komunitas karena mengandung
            pelanggaran atau spam.
          </p>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Review Service tidak terhubung. Aksi hapus ulasan atau dismiss laporan disimpan di
              basis penyimpanan data browser.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-red-50 text-red-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Total Dilaporkan
              </p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                {stats.totalReported} Ulasan
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                Menunggu respon admin
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-green-50 text-green-600 shrink-0">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ulasan Produk
              </p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                {stats.productReviews} Total
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                Katalog Marketplace B2B/B2C
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-blue-50 text-blue-600 shrink-0">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Ulasan Kursus
              </p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                {stats.courseReviews} Total
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 mt-0.5">SiTani Academy</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs bg-white rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600 shrink-0">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Bintang 1 Terdeteksi
              </p>
              <h3 className="text-xl font-bold text-slate-800 mt-0.5">
                {stats.criticalOneStar} Kasus
              </h3>
              <p className="text-[10px] font-semibold text-red-500 mt-0.5">
                Prioritas moderasi tinggi
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Cari komentar, alasan, atau item..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                setPage(1);
              }}
              className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl pl-9.5 h-10 w-full"
            />
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            {/* Type Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span>Tipe:</span>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent border-none text-slate-700 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Tipe</option>
                <option value="product">Produk Marketplace</option>
                <option value="course">Kursus Akademi</option>
              </select>
            </div>

            {/* Rating Filter */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl px-3 py-2 bg-slate-50">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span>Rating:</span>
              <select
                value={ratingFilter}
                onChange={(e) => {
                  setRatingFilter(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent border-none text-slate-700 font-bold focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Rating</option>
                <option value="1">Bintang 1</option>
                <option value="2">Bintang 2</option>
                <option value="3">Bintang 3</option>
                <option value="4">Bintang 4</option>
                <option value="5">Bintang 5</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-slate-200 bg-white rounded-2xl shadow-xs overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-4 p-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : !data || data.reviews.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-10 w-10 text-slate-300 mx-auto" />
              <h4 className="text-slate-800 text-xs font-bold mt-3">
                Tidak ada ulasan terlaporkan
              </h4>
              <p className="text-slate-400 text-[10px] mt-1">
                Semua ulasan dari pengguna dinilai bersih dan aman sejauh ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold">
                    <th className="p-4">Item Target</th>
                    <th className="p-4">Penulis</th>
                    <th className="p-4 text-center">Rating</th>
                    <th className="p-4 max-w-[280px]">Ulasan Komunitas</th>
                    <th className="p-4 max-w-[200px]">Alasan Dilaporkan</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {data.reviews.map((rev: ReportedReviewItem) => (
                    <tr key={rev.id} className="hover:bg-slate-50/40 transition-all">
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-slate-800 font-bold text-[12px] max-w-[180px] truncate">
                            {rev.item_title}
                          </span>
                          <span className="flex items-center gap-1 text-[10px]">
                            {rev.item_type === 'product' ? (
                              <span className="px-1.5 py-0.5 rounded bg-green-50 text-green-700 font-bold">
                                Produk
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">
                                Kursus
                              </span>
                            )}
                            <span className="text-slate-400">ID: {rev.item_id}</span>
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-800 font-bold">
                        {rev.buyer_name || rev.student_name || 'Pembeli Anonim'}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-0.5 font-bold text-slate-800 text-[11px]">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          <span>{rev.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 max-w-[280px] text-slate-500 leading-relaxed font-semibold italic">
                        &quot;{rev.comment}&quot;
                      </td>
                      <td className="p-4 max-w-[200px]">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50/60 border border-red-100 px-2 py-1 rounded-lg">
                          <AlertTriangle className="h-3 w-3" />
                          {rev.report_reason || 'Tidak ada alasan rinci'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            onClick={() => dismissReportMutation.mutate(rev.id)}
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 text-green-600 border-green-200 bg-green-50 hover:bg-green-100 hover:text-green-700 cursor-pointer rounded-xl shrink-0"
                            title="Abaikan Laporan (Ulasan Aman)"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              if (
                                confirm(
                                  'Apakah Anda yakin ingin menghapus ulasan ini secara permanen dari platform?'
                                )
                              ) {
                                deleteReviewMutation.mutate(rev.id);
                              }
                            }}
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 cursor-pointer rounded-xl shrink-0 border border-red-200"
                            title="Hapus Ulasan Permanen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination component */}
      {data && data.meta.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (page > 1) setPage(page - 1);
                  }}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              {[...Array(data.meta.totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                    isActive={page === i + 1}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    if (page < data.meta.totalPages) setPage(page + 1);
                  }}
                  className={
                    page >= data.meta.totalPages
                      ? 'pointer-events-none opacity-50'
                      : 'cursor-pointer'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
