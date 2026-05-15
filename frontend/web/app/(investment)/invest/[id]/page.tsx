'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { investmentService } from '@/services/investment';
import { InvestmentForm } from '@/components/features/investment/InvestmentForm';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  TrendingUp, 
  Leaf, 
  Target, 
  AlertTriangle,
  FileText,
  Map,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalId = params.id as string;

  const { data: proposalData, isLoading, isError } = useQuery({
    queryKey: ['proposal', proposalId],
    queryFn: () => investmentService.getProposalById(proposalId),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[400px] w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    );
  }

  if (isError || !proposalData?.data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Proposal Tidak Ditemukan</h2>
        <Link href="/invest">
          <Button className="mt-4">Kembali ke Daftar Investasi</Button>
        </Link>
      </div>
    );
  }

  const proposal = proposalData.data;
  const fundingNeeded = Number(proposal.funding_needed);
  const fundingRaised = Number(proposal.funding_raised);
  const raisedPercent = Math.min(Math.round((fundingRaised / fundingNeeded) * 100), 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/invest" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Kembali ke Jelajah Investasi
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header & Hero Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {proposal.commodity}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {proposal.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {proposal.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-gray-600">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                {proposal.location.city}, {proposal.location.province}
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Panen: {format(new Date(proposal.harvest_date_estimated), 'MMMM yyyy', { locale: id })}
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-600" />
                Petani ID: {proposal.farmer_id.slice(0, 8)}
              </div>
            </div>
          </div>

          {/* Funding Progress (Mobile & Desktop) */}
          <Card className="border-green-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-sm text-gray-500">Dana Terkumpul</p>
                  <p className="text-2xl font-bold text-green-700">
                    Rp {fundingRaised.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Target Dana</p>
                  <p className="text-lg font-semibold text-gray-900">
                    Rp {fundingNeeded.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
              
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-green-600 transition-all duration-1000" 
                  style={{ width: `${raisedPercent}%` }}
                />
              </div>
              <p className="text-sm font-medium text-gray-600 text-right">
                {raisedPercent}% Terpenuhi
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="text-center">
                  <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Estimasi ROI</p>
                  <p className="text-base font-bold text-gray-900">{proposal.projected_roi_percent}%</p>
                </div>
                <div className="text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Durasi</p>
                  <p className="text-base font-bold text-gray-900">{proposal.duration_days} Hari</p>
                </div>
                <div className="text-center">
                  <Map className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Luas Lahan</p>
                  <p className="text-base font-bold text-gray-900">{proposal.land_area_ha} Ha</p>
                </div>
                <div className="text-center">
                  <Leaf className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Komoditas</p>
                  <p className="text-base font-bold text-gray-900">{proposal.commodity}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Sections */}
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Deskripsi Proyek
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {proposal.description}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                Penggunaan Dana
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 p-6 rounded-xl border">
                {proposal.use_of_funds}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Analisis Risiko
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-yellow-50/30 p-6 rounded-xl border border-yellow-100">
                {proposal.risk_notes}
              </div>
            </section>
          </div>
        </div>

        {/* Sidebar / Investment Form */}
        <div>
          <InvestmentForm proposal={proposal} />
        </div>
      </div>
    </div>
  );
}
