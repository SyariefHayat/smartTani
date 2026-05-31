'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { academyService, Certificate } from '@/services/academy';
import { getStoredAuthUser } from '@/lib/auth-storage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Award,
  Calendar,
  Search,
  ExternalLink,
  Download,
  AlertTriangle,
  AwardIcon,
  BookOpen,
  FileCheck,
} from 'lucide-react';

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-1',
    enrollment_id: 'enroll-10',
    student_id: 'siswa-1',
    course_id: 'course-001',
    certificate_number: 'ST-ACADEMY-2026-8842',
    issued_at: '2026-05-20T14:30:00Z',
    course: {
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
    },
  },
  {
    id: 'cert-2',
    enrollment_id: 'enroll-11',
    student_id: 'siswa-1',
    course_id: 'course-004',
    certificate_number: 'ST-ACADEMY-2026-1092',
    issued_at: '2026-05-25T11:15:00Z',
    course: {
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
      enrolled_count: 2100,
      average_rating: 4.6,
      review_count: 310,
    },
  },
];

export default function StudentCertificatesPage() {
  const user = getStoredAuthUser();
  const [isOffline, setIsOffline] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: certificates, isLoading } = useQuery<Certificate[]>({
    queryKey: ['student-certificates', user?.id],
    queryFn: async () => {
      try {
        const res = await academyService.getMyCertificates();
        if (!res || res.length === 0) throw new Error('No certificates from API');
        return res;
      } catch {
        setIsOffline(true);
        // Fallback: load from localStorage + merge with mock data for rich UX
        const certKey = `certificates-${user?.id}`;
        const localData = localStorage.getItem(certKey);
        const localCerts = localData ? JSON.parse(localData) : [];

        // Merge without duplicates based on course_id
        const merged = [...localCerts];
        MOCK_CERTIFICATES.forEach((mock) => {
          if (!merged.some((c) => c.course_id === mock.course_id)) {
            merged.push(mock);
          }
        });

        return merged;
      }
    },
  });

  const filteredCerts = React.useMemo(() => {
    if (!certificates) return [];
    return certificates.filter((cert) => {
      const title = cert.course?.title?.toLowerCase() || '';
      const num = cert.certificate_number?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      return title.includes(query) || num.includes(query);
    });
  }, [certificates, searchQuery]);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Sertifikat Belajar Saya 🏆
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Unduh dan bagikan pencapaian akademik Anda di SiTani Academy.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Menampilkan sertifikat yang disimpan secara
              lokal di peramban Anda.
            </p>
          </div>
        </div>
      )}

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Cari nama kursus atau nomor sertifikat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-slate-200 text-xs font-medium focus:ring-slate-400 focus-visible:ring-slate-400 rounded-xl"
          />
        </div>
        <div className="text-[11px] font-semibold text-slate-500 sm:ml-auto">
          Menampilkan <span className="font-bold text-slate-800">{filteredCerts.length}</span>{' '}
          sertifikat
        </div>
      </div>

      {/* Certificates Grid */}
      {filteredCerts.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/50 py-12 flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3 border border-slate-200">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-700">Belum Ada Sertifikat</h3>
          <p className="text-xs font-semibold text-slate-400 max-w-xs mt-1 px-4">
            {searchQuery
              ? 'Tidak ada sertifikat yang cocok dengan pencarian Anda.'
              : 'Selesaikan satu kursus hingga 100% progres modul untuk menerbitkan sertifikat otomatis.'}
          </p>
          {!searchQuery && (
            <Link href="/dashboard/siswa/courses" passHref legacyBehavior>
              <Button
                size="sm"
                className="mt-4 bg-slate-800 hover:bg-slate-900 text-xs font-semibold text-white rounded-xl shadow-sm gap-2 cursor-pointer"
              >
                <BookOpen className="h-3.5 w-3.5" />
                Mulai Belajar Sekarang
              </Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCerts.map((cert) => {
            const issuedDate = new Date(cert.issued_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });

            return (
              <Card
                key={cert.id}
                className="border-slate-200 bg-white hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden flex flex-col group"
              >
                {/* Visual Top Decorative Seal */}
                <div className="h-1.5 bg-slate-700" />

                <CardContent className="pt-6 flex-1 flex flex-col gap-4">
                  {/* Decorative Icon */}
                  <div className="flex items-start justify-between">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 shadow-sm">
                      <AwardIcon className="h-5.5 w-5.5" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-500 uppercase tracking-wider">
                      {cert.course?.category || 'Academy'}
                    </span>
                  </div>

                  {/* Course Details */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 line-clamp-2 min-h-10 group-hover:text-slate-700 transition-colors">
                      {cert.course?.title}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400">
                      Pengajar: {cert.course?.instructor_name || 'Instruktur SiTani'}
                    </p>
                  </div>

                  {/* Cert Specs */}
                  <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-3 space-y-2 mt-auto text-[11px] font-medium text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">No. Sertifikat:</span>
                      <span className="font-mono font-bold text-slate-700">
                        {cert.certificate_number}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Diterbitkan:</span>
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        {issuedDate}
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="bg-slate-50/50 border-t border-slate-100/70 p-4 grid grid-cols-2 gap-2">
                  <Link href={`/dashboard/siswa/certificates/${cert.id}`} passHref legacyBehavior>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-100 rounded-xl"
                    >
                      <FileCheck className="h-3.5 w-3.5 mr-1 text-slate-500" />
                      Detail
                    </Button>
                  </Link>
                  <Link href={`/dashboard/siswa/certificates/${cert.id}`} passHref legacyBehavior>
                    <Button
                      size="sm"
                      className="w-full text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-xl shadow-sm cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 mr-1" />
                      Unduh PDF
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
