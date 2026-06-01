'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { instructorService } from '@/services/instructor';
import { academyService, Course } from '@/services/academy';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  BookOpen,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  ListOrdered,
  Users,
  Star,
  Globe,
  Archive,
  AlertTriangle,
  Calendar,
  RefreshCw,
} from 'lucide-react';

const MOCK_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Budidaya Hidroponik Modern untuk Pemula',
    description: 'Materi dasar teknik hidroponik menggunakan sistem NFT dan Drip.',
    short_description: 'Pelajari dasar-dasar berkebun bersih dengan air.',
    category: 'Budidaya',
    difficulty: 'pemula',
    mode: 'online',
    duration_hours: 12,
    instructor_id: 'inst-1',
    instructor_name: 'Dr. Ir. Heri Susanto',
    instructor_title: 'Dosen Agroteknologi IPB',
    price: 0,
    is_free: true,
    is_published: true,
    enrolled_count: 1450,
    average_rating: 4.8,
    review_count: 180,
    created_at: '2026-05-15T08:00:00Z',
    modules: [],
  },
  {
    id: 'course-002',
    title: 'Manajemen Keuangan & Bisnis Tani Mandiri',
    description: 'Materi dasar teknik mengelola arus kas usaha tani.',
    short_description: 'Mengelola keuangan komoditas agar untung besar.',
    category: 'Bisnis Tani',
    difficulty: 'menengah',
    mode: 'online',
    duration_hours: 15,
    instructor_id: 'inst-1',
    instructor_name: 'Budi Santoso, MBA',
    instructor_title: 'Praktisi Agribisnis & Investor',
    price: 0,
    is_free: true,
    is_published: false,
    enrolled_count: 0,
    average_rating: 0,
    review_count: 0,
    created_at: '2026-05-18T10:00:00Z',
    modules: [],
  },
  {
    id: 'course-004',
    title: 'Pencegahan Hama Organik Terpadu',
    description: 'Teknik pembuatan pestisida hayati dan pengendali alami tanpa bahan kimia.',
    short_description: 'Jaga kebersihan lahan dan hasil panen tanpa racun.',
    category: 'Budidaya',
    difficulty: 'pemula',
    mode: 'online',
    duration_hours: 8,
    instructor_id: 'inst-1',
    instructor_name: 'Dr. Ir. Heri Susanto',
    instructor_title: 'Dosen Agroteknologi IPB',
    price: 0,
    is_free: true,
    is_published: true,
    enrolled_count: 310,
    average_rating: 4.6,
    review_count: 12,
    created_at: '2026-05-22T08:00:00Z',
    modules: [],
  },
];

export default function InstructorCoursesPage() {
  const user = getStoredAuthUser();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'published' | 'draft'>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const {
    data: courses,
    isLoading,
    isError,
    refetch,
  } = useQuery<Course[]>({
    queryKey: ['instructor-courses', user?.id],
    queryFn: async () => {
      const res = await instructorService.getMyCourses();
      if (!res || !res.courses) throw new Error('Gagal memuat daftar kursus');
      return res.courses;
    },
  });

  React.useEffect(() => {
    if (isError) {
      toast.error('Koneksi ke Layanan Academy terputus.');
    }
  }, [isError]);

  const publishMutation = useMutation({
    mutationFn: async (args: { id: string; publish: boolean }) => {
      await instructorService.publishCourse(args.id, args.publish);
    },
    onSuccess: (_, variables) => {
      toast.success(
        variables.publish
          ? 'Kursus berhasil terpublikasi ke katalog murid!'
          : 'Kursus ditarik dari publikasi katalog.'
      );
      queryClient.invalidateQueries({ queryKey: ['instructor-courses', user?.id] });
    },
    onError: () => {
      toast.error('Gagal memperbarui status publikasi kursus.');
    },
  });

  const filteredCourses = React.useMemo(() => {
    if (!courses) return [];
    return courses.filter((c) => {
      const matchSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && c.is_published) ||
        (statusFilter === 'draft' && !c.is_published);
      return matchSearch && matchStatus;
    });
  }, [courses, searchQuery, statusFilter]);

  const totalRows = filteredCourses.length;
  const totalPages = Math.ceil(totalRows / itemsPerPage);
  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const toRow = Math.min(currentPage * itemsPerPage, totalRows);

  const paginatedCourses = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(start, start + itemsPerPage);
  }, [filteredCourses, currentPage, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full space-y-6 text-slate-900 pb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Daftar Kursus Saya 📚
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Kembangkan kurikulum, kelola urutan modul, and tinjau ulasan kelas pertanian.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 px-6">
          <AlertTriangle className="h-8 w-8 text-red-400 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-red-500 mb-1">Gagal Memuat Daftar Kursus</p>
          <p className="text-xs text-red-400 mb-4">
            Koneksi ke server Academy terputus. Silakan coba lagi.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 bg-white hover:bg-red-100 font-bold text-xs gap-1.5"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Hubungkan Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Daftar Kursus Saya 📚
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Kembangkan kurikulum, kelola urutan modul, and tinjau ulasan kelas pertanian.
          </p>
        </div>
        <Link href="/dashboard/instruktur/courses/create" passHref legacyBehavior>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Buat Kelas Baru
          </Button>
        </Link>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Cari judul kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-slate-200 text-xs font-semibold focus:ring-slate-800 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl max-w-fit self-end sm:self-auto">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'ghost'}
            onClick={() => setStatusFilter('all')}
            size="sm"
          >
            Semua
          </Button>
          <Button
            variant={statusFilter === 'published' ? 'default' : 'ghost'}
            onClick={() => setStatusFilter('published')}
            size="sm"
          >
            Published
          </Button>
          <Button
            variant={statusFilter === 'draft' ? 'default' : 'ghost'}
            onClick={() => setStatusFilter('draft')}
            size="sm"
          >
            Draft
          </Button>
        </div>
      </div>

      {/* Courses List Layout */}
      {filteredCourses.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/50 py-16 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200">
            <BookOpen className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Kursus</h3>
          <p className="text-xs font-semibold text-slate-400 max-w-xs mt-1 px-4">
            {searchQuery
              ? 'Tidak ada kelas yang cocok dengan pencarian Anda.'
              : 'Anda belum mempublikasikan atau membuat draf kurikulum di SiTani Academy.'}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/instruktur/courses/create" passHref legacyBehavior>
              <Button size="sm" className="mt-4">
                <Plus className="h-4 w-4" />
                Mulai Susun Kursus Pertama
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm p-4">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/70 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <TableHead className="py-3 px-4">Kelas & Kategori</TableHead>
                <TableHead className="py-3 px-4">Kemajuan Modul</TableHead>
                <TableHead className="py-3 px-4">Peserta</TableHead>
                <TableHead className="py-3 px-4">Rating Kepuasan</TableHead>
                <TableHead className="py-3 px-4">Status</TableHead>
                <TableHead className="py-3 px-4 text-right">Kelola</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-xs font-semibold text-slate-700">
              {paginatedCourses.map((course) => {
                const createdDate = course.created_at
                  ? new Date(course.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '-';

                return (
                  <TableRow key={course.id} className="hover:bg-slate-50/40 transition-colors">
                    <TableCell className="py-4 px-4 space-y-1">
                      <h4 className="font-bold text-slate-800 text-[12px]">{course.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                        <span>{course.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-3 w-3 text-slate-300" />
                          Dibuat: {createdDate}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4 font-mono font-bold text-slate-500">
                      {course.duration_hours} Jam Belajar
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Users className="h-4.5 w-4.5 text-slate-400" />
                        <span>{course.enrolled_count} Murid</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {course.average_rating > 0 ? (
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-lg text-[10px] max-w-fit">
                          <Star className="h-3 w-3 text-slate-400" />
                          <span>
                            {course.average_rating} ({course.review_count} Ulasan)
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">Belum Ada</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-4">
                      {course.is_published ? (
                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200/60">
                          Terpublikasi
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-transparent">
                          Draf
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="h-4 w-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 bg-white border border-slate-200 rounded-xl shadow-md p-1.5 text-slate-700"
                        >
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/instruktur/courses/${course.id}/edit`)
                            }
                            className="rounded-lg text-xs cursor-pointer gap-2 py-2"
                          >
                            <Edit2 className="h-3.5 w-3.5 text-slate-400" />
                            Edit Deskripsi
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/instruktur/courses/${course.id}/modules`)
                            }
                            className="rounded-lg text-xs cursor-pointer gap-2 py-2"
                          >
                            <ListOrdered className="h-3.5 w-3.5 text-slate-400" />
                            Kelola Modul
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              router.push(`/dashboard/instruktur/courses/${course.id}/students`)
                            }
                            className="rounded-lg text-xs cursor-pointer gap-2 py-2"
                          >
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            Lihat Murid
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-slate-100 my-1" />
                          {course.is_published ? (
                            <DropdownMenuItem
                              onClick={() =>
                                publishMutation.mutate({ id: course.id, publish: false })
                              }
                              className="rounded-lg text-xs cursor-pointer gap-2 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                            >
                              <Archive className="h-3.5 w-3.5 text-slate-400" />
                              Unpublish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() =>
                                publishMutation.mutate({ id: course.id, publish: true })
                              }
                              className="rounded-lg text-xs cursor-pointer gap-2 py-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                            >
                              <Globe className="h-3.5 w-3.5" />
                              Publish Kelas
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-4">
            <div className="text-xs font-semibold text-slate-500">
              Menampilkan{' '}
              <span className="font-bold text-slate-800">
                {fromRow}–{toRow}
              </span>{' '}
              dari <span className="font-bold text-slate-800">{totalRows}</span> kelas
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || totalRows === 0}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalRows === 0}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
