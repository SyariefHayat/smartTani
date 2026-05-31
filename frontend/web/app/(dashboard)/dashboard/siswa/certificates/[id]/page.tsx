'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { academyService, Certificate } from '@/services/academy';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Award,
  ChevronLeft,
  Printer,
  Download,
  Calendar,
  ShieldCheck,
  Share2,
  AlertTriangle,
  QrCode,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CertificateDetailPage({ params }: PageProps) {
  const router = useRouter();
  const user = getStoredAuthUser();
  const { id } = React.use(params);
  const {
    data: cert,
    isLoading,
    isError: isCertError,
    refetch: refetchCert,
  } = useQuery<Certificate | null>({
    queryKey: ['student-certificate', id, user?.id],
    queryFn: () => academyService.getCertificateById(id),
  });

  React.useEffect(() => {
    if (isCertError) {
      toast.error('Koneksi ke Layanan Academy terputus.');
    }
  }, [isCertError]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Tautan sertifikat berhasil disalin ke papan klip!');
    } else {
      toast.error('Gagal menyalin tautan.');
    }
  };

  if (isCertError) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 p-8 text-center text-red-500 font-semibold text-sm">
        <AlertTriangle className="h-8 w-8 text-red-600 mb-2 animate-pulse" />
        <p className="font-bold">Gagal memuat detail sertifikat</p>
        <p className="text-xs text-red-400 font-normal mt-1 mb-4">
          Koneksi ke server Layanan Academy terputus. Silakan coba hubungkan kembali.
        </p>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/siswa/certificates" passHref legacyBehavior>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 bg-white hover:bg-slate-50 font-bold text-xs cursor-pointer"
            >
              Kembali ke Daftar
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold text-xs cursor-pointer"
            onClick={() => refetchCert()}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Coba Hubungkan Kembali
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl ml-auto" />
        </div>
        <Skeleton className="h-[500px] w-full rounded-2xl" />
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="w-full text-center py-20 space-y-4">
        <div className="h-12 w-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">Sertifikat Tidak Ditemukan</h3>
        <p className="text-xs font-semibold text-slate-400 max-w-sm mx-auto">
          Sertifikat dengan ID ini tidak terdaftar atau tidak dimiliki oleh akun Anda.
        </p>
        <Button
          onClick={() => router.push('/dashboard/siswa/certificates')}
          size="sm"
          className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-sm text-xs font-semibold cursor-pointer"
        >
          Kembali ke Daftar
        </Button>
      </div>
    );
  }

  const issuedDate = new Date(cert.issued_at).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* CSS overrides for print */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .printable-cert,
          .printable-cert * {
            visibility: visible;
          }
          .printable-cert {
            position: absolute;
            left: 0;
            top: 0;
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 20px;
            border: none !important;
            box-shadow: none !important;
            transform: scale(0.98);
            transform-origin: top left;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Floating Action Header (no-print) */}
      <div className="no-print flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/siswa/certificates" passHref legacyBehavior>
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleShare}
            size="sm"
            className="text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
          >
            <Share2 className="h-3.5 w-3.5 mr-1.5" />
            Bagikan
          </Button>
          <Button
            onClick={handlePrint}
            size="sm"
            className="bg-slate-800 hover:bg-slate-900 text-xs font-semibold text-white rounded-xl shadow-sm gap-1.5 cursor-pointer"
          >
            <Printer className="h-3.5 w-3.5" />
            Cetak / PDF
          </Button>
        </div>
      </div>

      {/* Physical Certificate Landscape Card */}
      <div className="w-full overflow-x-auto py-4 flex justify-center bg-slate-50 rounded-2xl border border-slate-100 p-2 sm:p-6 no-print-background">
        <Card
          className="printable-cert relative bg-white border-[14px] border-double border-emerald-800 shadow-xl rounded-none p-8 sm:p-12 w-full max-w-[900px] aspect-[1.414/1] flex flex-col items-center justify-between overflow-hidden"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(236,253,245,0.3) 0%, rgba(255,255,255,1) 80%)',
          }}
        >
          {/* Subtle Guilloche Corner Ornaments (Custom SVGs) */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-950/20" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-950/20" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-950/20" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-950/20" />

          {/* Certificate Header */}
          <div className="text-center space-y-2 mt-4">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs uppercase tracking-widest">
              <Award className="h-5 w-5 text-amber-500" />
              SiTani Academy Ecosystem
            </div>
            <h2 className="text-3xl font-extrabold tracking-wider text-slate-800 uppercase font-serif">
              Sertifikat Kelulusan
            </h2>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto" />
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-1">
              ID Kredensial: {cert.certificate_number}
            </p>
          </div>

          {/* Statement */}
          <div className="text-center space-y-4 max-w-2xl">
            <p className="text-xs text-slate-500 font-medium italic">
              Dengan ini menerangkan bahwa murid terbaik kami:
            </p>
            <h3 className="text-2xl font-bold tracking-wide text-slate-800 border-b border-slate-200 pb-2 max-w-md mx-auto font-serif">
              {user?.name || 'Siswa Berprestasi'}
            </h3>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                Telah menyelesaikan dengan hasil sangat memuaskan seluruh rangkaian pelatihan materi
                kurikulum:
              </p>
              <h4 className="text-lg font-extrabold text-emerald-800 italic font-serif">
                &quot;{cert.course?.title}&quot;
              </h4>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                Kategori: {cert.course?.category || 'Budidaya Pertanian'} • Durasi:{' '}
                {cert.course?.duration_hours || 10} Jam Pelajaran
              </p>
            </div>
          </div>

          {/* Signatures & Seal Footer */}
          <div className="w-full grid grid-cols-3 items-end justify-between mt-8 text-center px-6">
            {/* Left Signee */}
            <div className="flex flex-col items-center">
              <div className="h-10 flex items-center justify-center text-xs font-bold text-slate-400 font-serif italic select-none">
                {cert.course?.instructor_name}
              </div>
              <div className="w-28 h-px bg-slate-300 my-1" />
              <span className="text-[9px] font-bold text-slate-700">
                {cert.course?.instructor_name}
              </span>
              <span className="text-[8px] font-semibold text-slate-400">Instruktur Kelas</span>
            </div>

            {/* Middle Seal */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative h-16 w-16 bg-amber-500 rounded-full border-4 border-amber-600/80 flex items-center justify-center text-white shadow-md transform rotate-12">
                {/* Ribbon tails */}
                <div className="absolute -bottom-2 -left-1 w-4 h-8 bg-amber-600/90 transform rotate-12 origin-top -z-10" />
                <div className="absolute -bottom-2 -right-1 w-4 h-8 bg-amber-600/90 transform -rotate-12 origin-top -z-10" />
                <ShieldCheck className="h-7 w-7 text-white animate-pulse" />
              </div>
              <span className="text-[9px] font-bold text-amber-700 uppercase tracking-widest mt-2">
                LULUS VERIFIKASI
              </span>
            </div>

            {/* Right Signee */}
            <div className="flex flex-col items-center">
              <div className="h-10 flex items-center justify-center text-xs font-bold text-slate-400 font-serif italic select-none">
                Syarief H.
              </div>
              <div className="w-28 h-px bg-slate-300 my-1" />
              <span className="text-[9px] font-bold text-slate-700">Syarief Hayat</span>
              <span className="text-[8px] font-semibold text-slate-400">Co-founder SmartTani</span>
            </div>
          </div>

          {/* Small Verification Footer */}
          <div className="w-full flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-[8px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-600" />
              Sertifikat sah diterbitkan secara elektronik oleh SmartTani Academy pada tanggal{' '}
              {issuedDate}
            </span>
            <span className="flex items-center gap-1 font-mono uppercase">
              <QrCode className="h-3.5 w-3.5 text-slate-400" />
              VERIFIED BY BLOCKCHAIN SMARTTANI
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
