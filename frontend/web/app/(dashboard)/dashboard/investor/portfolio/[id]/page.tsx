'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { investmentService } from '@/services/investment';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Landmark, Sprout, Calendar, AlertTriangle, UserCheck } from 'lucide-react';

const MOCK_INVESTMENT_DETAIL = {
  id: 'INV-001',
  amount: 15000000,
  invested_at: '2026-05-20T08:00:00Z',
  status: 'paid',
  projected_return: 17250000,
  actual_return: null,
  platform_fee_percent: 2,
  proposal: {
    id: 'PROP-01',
    title: 'Budidaya Cabai Merah Keriting Hidroponik',
    commodity: 'Cabai Merah',
    projected_roi_percent: 15,
    duration_days: 120,
    harvest_date_estimated: '2026-09-15T00:00:00Z',
    description:
      'Budidaya cabai merah keriting berkualitas prima menggunakan nutrisi hidroponik modern yang terkontrol secara iklim.',
    location: {
      province: 'Jawa Barat',
      city: 'Cianjur',
      district: 'Pacet',
      full_address: 'Desa Cipendawa',
    },
  },
  farmer: {
    name: 'Ahmad Sodikin',
    phone: '0812-7788-9900',
    avatar_url: '/images/avatars/farmer-avatar.png',
    experience_years: 8,
    rating: 4.9,
  },
  timeline: [
    {
      title: 'Modal Investasi Diserahkan',
      time: '2026-05-20T09:00:00Z',
      description: 'Dana modal sebesar Rp 15.000.000 telah berhasil ditransfer ke petani.',
      isCompleted: true,
    },
    {
      title: 'Persiapan Greenhouse & Tanam',
      time: '2026-05-22T08:00:00Z',
      description:
        'Greenhouse disterilisasi, nutrisi dialirkan, dan bibit cabai merah mulai ditanam.',
      isCompleted: true,
    },
    {
      title: 'Perawatan & Monitoring Rutin',
      time: '2026-06-15T00:00:00Z',
      description: 'Pemantauan EC nutrisi dan kelembaban udara harian via alat smart farming.',
      isCompleted: false,
    },
    {
      title: 'Masa Panen Raya',
      time: '2026-09-15T00:00:00Z',
      description: 'Pemanenan cabai merah kualitas gred A dan distribusi ke supplier/marketplace.',
      isCompleted: false,
    },
    {
      title: 'Bagi Hasil (ROI) Cair',
      time: '2026-09-20T00:00:00Z',
      description: 'Dana bagi hasil investasi ditransfer langsung ke dompet digital Anda.',
      isCompleted: false,
    },
  ],
};

export default function InvestorInvestmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const investmentId = String(params.id);

  // In Q1, we fetch getPortfolio and match the item, or fetch single detail
  const {
    data: portfolioResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['investor-portfolio-list-detail'],
    queryFn: () => investmentService.getPortfolio(),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan detail investasi offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan data investasi simulasi agar Anda tetap dapat mengevaluasi antarmuka.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const investment = React.useMemo(() => {
    if (isQueryError || !portfolioResponse?.data) {
      return MOCK_INVESTMENT_DETAIL;
    }
    const found = portfolioResponse.data.find((item) => item.id === investmentId);
    if (!found) return MOCK_INVESTMENT_DETAIL;
    // Map missing items from mock
    return {
      ...MOCK_INVESTMENT_DETAIL,
      ...found,
    };
  }, [portfolioResponse, investmentId, isQueryError]);

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  const isCompleted = investment.status === 'completed';

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 shadow-xs">
          <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-red-800">Layanan Detail Investasi Offline</p>
            <p className="text-[10px] text-red-600 font-medium">
              Koneksi ke server terputus. Gagal memuat data teraktual.
            </p>
          </div>
        </div>
      )}

      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/dashboard/investor/portfolio')}
        className="cursor-pointer font-bold text-slate-500 hover:text-slate-900 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Portofolio
      </Button>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3): Timeline and farming stages */}
        <div className="lg:col-span-2 space-y-6">
          {/* Investment Header info */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <span className="font-mono text-xs font-semibold text-slate-400">
                  ID INVESTASI: #{investment.id}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'}`}
                  />
                  {isCompleted ? 'Pendanaan Selesai' : 'Pertanian Aktif'}
                </span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 leading-tight">
                  {investment.proposal.title}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Komoditas: {investment.proposal.commodity || ''} • Lokasi:{' '}
                  {investment.proposal.location?.city || ''},{' '}
                  {investment.proposal.location?.province || ''}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Farming stage timeline */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <Sprout className="h-4.5 w-4.5 text-green-600" />
                Linimasa & Progress Pertanian
              </CardTitle>
              <CardDescription className="text-xs">
                Lacak status implementasi modal Anda secara realtime di kebun.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
                {investment.timeline.map((step, idx) => (
                  <div key={idx} className="relative pl-6">
                    {/* Bullet */}
                    <span
                      className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                        step.isCompleted
                          ? 'bg-green-600 border-green-200 animate-pulse'
                          : 'bg-white border-slate-300'
                      }`}
                    />
                    <div className="space-y-0.5">
                      <h4
                        className={`text-xs font-bold ${step.isCompleted ? 'text-green-600' : 'text-slate-700'}`}
                      >
                        {step.title}
                      </h4>
                      {step.time && (
                        <p className="text-[9px] text-slate-400 font-bold">
                          {format(new Date(step.time), 'dd MMM yyyy')}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3): ROI card and Farmer Profile */}
        <div className="space-y-6">
          {/* ROI Invoicing details */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <Landmark className="h-4.5 w-4.5 text-green-600" />
                Rincian Keuangan & ROI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Dana Ditempatkan</span>
                  <span className="font-bold text-slate-800">
                    {formatCurrency(investment.amount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Bagi Hasil Kontrak</span>
                  <span className="font-bold text-blue-600">
                    +{investment.proposal.projected_roi_percent}%
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500">
                  <span>Platform Fee (2%)</span>
                  <span className="font-bold text-rose-500">
                    -{formatCurrency(investment.amount * (investment.platform_fee_percent / 100))}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-500 pt-3 border-t border-slate-100">
                  <span>Estimasi Return</span>
                  <span className="font-bold text-green-700">
                    {formatCurrency(investment.projected_return)}
                  </span>
                </div>
                {isCompleted && investment.actual_return && (
                  <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1">
                    <span>ROI Aktual Diterima</span>
                    <span className="font-extrabold text-emerald-600">
                      {formatCurrency(investment.actual_return)}
                    </span>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 space-y-1">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" /> Estimasi Panen
                </p>
                <p className="text-xs font-bold text-slate-700">
                  {format(
                    new Date(
                      investment.proposal.harvest_date_estimated ||
                        MOCK_INVESTMENT_DETAIL.proposal.harvest_date_estimated
                    ),
                    'dd MMMM yyyy'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Farmer Profile */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <UserCheck className="h-4.5 w-4.5 text-green-600" />
                Profil Pengelola Lahan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 font-bold text-sm shrink-0 uppercase">
                {investment.farmer.name.slice(0, 2)}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800">{investment.farmer.name}</h4>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {investment.farmer.experience_years} tahun pengalaman tani
                </p>
                <p className="text-[10px] text-green-700 font-extrabold">
                  ★ {investment.farmer.rating} Rating Petani
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
