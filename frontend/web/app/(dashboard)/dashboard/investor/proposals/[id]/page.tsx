'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { investmentService, Proposal } from '@/services/investment';
import { InvestmentForm } from '@/components/features/investment/InvestmentForm';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  TrendingUp,
  Info,
  AlertTriangle,
  RefreshCw,
  Layers,
  ShieldAlert,
  FileCheck,
  Sprout,
  Landmark,
} from 'lucide-react';

const MOCK_PROPOSAL_DETAIL = {
  id: 'PROP-01',
  farmer_id: 'F-01',
  title: 'Budidaya Cabai Merah Keriting Hidroponik',
  commodity: 'Cabai Merah',
  land_area_ha: 0.8,
  location: {
    province: 'Jawa Barat',
    city: 'Cianjur',
    district: 'Pacet',
    full_address: 'Desa Cipendawa',
  },
  funding_needed: 30000000,
  funding_raised: 15000000,
  projected_roi_percent: 15,
  duration_days: 120,
  harvest_date_estimated: '2026-09-15T00:00:00Z',
  description:
    'Budidaya cabai merah keriting berkualitas prima menggunakan nutrisi hidroponik modern yang terkontrol secara iklim di wilayah Pacet, Cianjur. Metode ini menghasilkan hasil panen 3 kali lipat lebih melimpah dibandingkan metode konvensional dengan tingkat higienitas premium.',
  use_of_funds:
    'Sewa greenhouse berukuran 800m2 (Rp 10.000.000), instalasi sistem irigasi tetes otomatis (Rp 8.000.000), pengadaan nutrisi AB Mix khusus hortikultura untuk 1 siklus tanam penuh (Rp 6.000.000), serta upah 2 tenaga kerja harian lokal selama 4 bulan (Rp 6.000.000).',
  risk_notes:
    'Fluktuasi suhu greenhouse yang terlampau tinggi di puncak musim kemarau dapat diantisipasi dengan sistem sirkulasi angin (exhaust fan) yang telah kami siapkan. Risiko serangan kutu kebul dicegah menggunakan perangkap perekat kuning dan pengaplikasian pestisida nabati secara berkala.',
  supporting_docs: [
    'Sertifikasi Tanah Lahan Pacet',
    'Rencana Anggaran Biaya Hidroponik',
    'Sertifikasi Kelayakan Hortikultura',
  ],
  status: 'approved' as const,
  created_at: '2026-05-20T08:00:00Z',
  updated_at: '2026-05-20T08:00:00Z',
};

export default function InvestorProposalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = String(params.id);

  const {
    data: proposalResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['investor-proposal-detail', proposalId],
    queryFn: () => investmentService.getProposalById(proposalId),
    enabled: !!proposalId,
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan proposal offline. Menggunakan data simulasi.', {
        description: 'Menampilkan data proyek detail agar Anda tetap dapat mengevaluasi antarmuka.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const proposal = isQueryError
    ? MOCK_PROPOSAL_DETAIL
    : proposalResponse?.data || MOCK_PROPOSAL_DETAIL;

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

  const raisedPercent = Math.min(
    Math.round((Number(proposal.funding_raised) / Number(proposal.funding_needed)) * 100),
    100
  );

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Layanan Proposal Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data simulasi detail proyek. Beberapa pengiriman dana baru hanya akan
                diproses lokal.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-[10px] font-bold border-amber-300 text-amber-700 bg-white hover:bg-amber-100 hover:text-amber-800 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Coba Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/dashboard/investor/proposals')}
        className="cursor-pointer font-bold text-slate-500 hover:text-slate-900 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar Peluang
      </Button>

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Detail Contents (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Section */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 border border-green-200">
                  {proposal.commodity}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {proposal.location.district}, {proposal.location.city},{' '}
                  {proposal.location.province}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 leading-tight">
                  {proposal.title}
                </h1>
                <p className="text-xs text-slate-500 font-medium">
                  Lahan budidaya seluas {proposal.land_area_ha} Ha dikelola oleh Petani Mitra
                  SmartTani.
                </p>
              </div>

              {/* Progress Funding Bar */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-500">Kebutuhan Dana Terkumpul</span>
                  <span className="text-green-600">{raisedPercent}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600 rounded-full transition-all duration-500"
                    style={{ width: `${raisedPercent}%` }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold pt-1">
                  <span className="text-slate-800">
                    Rp {Number(proposal.funding_raised).toLocaleString('id-ID')}
                  </span>
                  <span className="text-slate-400 font-medium">
                    Target: Rp {Number(proposal.funding_needed).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Proyeksi ROI
                  </span>
                  <span className="text-sm font-bold text-green-700 block flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5 shrink-0" />+{proposal.projected_roi_percent}
                    %
                  </span>
                </div>
                <div className="space-y-1 border-l border-slate-100 pl-4">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Durasi Proyek
                  </span>
                  <span className="text-sm font-bold text-slate-800 block flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {proposal.duration_days} Hari
                  </span>
                </div>
                <div className="space-y-1 border-l border-slate-100 pl-4">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                    Estimasi Panen
                  </span>
                  <span className="text-sm font-bold text-slate-800 block flex items-center gap-1">
                    <Sprout className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    {new Date(proposal.harvest_date_estimated).toLocaleDateString('id-ID', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Tabs */}
          <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardContent className="p-0">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start rounded-none bg-slate-50 border-b border-slate-100 p-0 h-11">
                  <TabsTrigger
                    value="description"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-white px-5 text-xs font-bold text-slate-500 data-[state=active]:text-slate-800 cursor-pointer h-full"
                  >
                    <Layers className="h-3.5 w-3.5 mr-1.5" /> Deskripsi
                  </TabsTrigger>
                  <TabsTrigger
                    value="funds"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-white px-5 text-xs font-bold text-slate-500 data-[state=active]:text-slate-800 cursor-pointer h-full"
                  >
                    <Landmark className="h-3.5 w-3.5 mr-1.5" /> Penggunaan Dana
                  </TabsTrigger>
                  <TabsTrigger
                    value="risk"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-white px-5 text-xs font-bold text-slate-500 data-[state=active]:text-slate-800 cursor-pointer h-full"
                  >
                    <ShieldAlert className="h-3.5 w-3.5 mr-1.5" /> Analisis Risiko
                  </TabsTrigger>
                  <TabsTrigger
                    value="docs"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-white px-5 text-xs font-bold text-slate-500 data-[state=active]:text-slate-800 cursor-pointer h-full"
                  >
                    <FileCheck className="h-3.5 w-3.5 mr-1.5" /> Dokumen Pendukung
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="p-6 focus-visible:outline-none">
                  <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                    Rencana Budidaya Pertanian
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {proposal.description}
                  </p>
                </TabsContent>

                <TabsContent value="funds" className="p-6 focus-visible:outline-none">
                  <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                    Breakdown Distribusi Dana Modal
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {proposal.use_of_funds}
                  </p>
                </TabsContent>

                <TabsContent value="risk" className="p-6 focus-visible:outline-none">
                  <h3 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider">
                    Identifikasi Risiko & Strategi Mitigasi
                  </h3>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {proposal.risk_notes}
                  </p>
                </TabsContent>

                <TabsContent value="docs" className="p-6 focus-visible:outline-none">
                  <h3 className="text-xs font-bold text-slate-700 mb-3.5 uppercase tracking-wider">
                    Dokumen Legalitas & Teknis Resmi
                  </h3>
                  {proposal.supporting_docs.length === 0 ? (
                    <p className="text-xs text-slate-400 font-medium italic">
                      Tidak ada dokumen pendukung yang diunggah.
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {proposal.supporting_docs.map((doc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-xs font-semibold text-slate-700">{doc}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-[10px] font-bold text-green-600 hover:text-green-700 cursor-pointer"
                          >
                            Unduh PDF
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Investment Form Sidebar (1/3) */}
        <div>
          <InvestmentForm proposal={proposal as unknown as Proposal} />
        </div>
      </div>
    </div>
  );
}
