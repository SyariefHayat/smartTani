'use client';

import { Proposal } from '@/services/investment';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface ProposalCardProps {
  proposal: Proposal;
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  const raisedPercent = Math.min(
    Math.round((Number(proposal.funding_raised) / Number(proposal.funding_needed)) * 100),
    100
  );

  return (
    <Card className="flex flex-col h-full hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border-slate-100 overflow-hidden bg-white">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2 mb-2.5">
          <Badge
            variant="outline"
            className="bg-emerald-50/80 text-emerald-700 border-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
          >
            {proposal.commodity}
          </Badge>
          <div className="flex items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
            {proposal.location.city}
          </div>
        </div>
        <CardTitle className="text-base font-bold text-slate-900 line-clamp-2 leading-snug tracking-tight">
          {proposal.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5 font-medium">
            <span className="text-slate-500">Dana Terkumpul</span>
            <span className="font-bold text-emerald-600">{raisedPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-500 rounded-full"
              style={{ width: `${raisedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5 font-semibold">
            <span className="text-slate-800 font-bold">
              Rp {Number(proposal.funding_raised).toLocaleString('id-ID')}
            </span>
            <span className="text-slate-400 font-normal text-[10px]">
              dari Rp {Number(proposal.funding_needed).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-500 shrink-0" />
              PROYEKSI ROI
            </div>
            <p className="text-sm font-extrabold text-emerald-600">
              +{proposal.projected_roi_percent || 0}% ROI
            </p>
          </div>
          <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">
              <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
              DURASI
            </div>
            <p className="text-sm font-bold text-slate-800">{proposal.duration_days} Hari</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/dashboard/investor/proposals/${proposal.id}`} className="w-full">
          <Button className="w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs py-5 transition-colors cursor-pointer flex items-center justify-center gap-1">
            Lihat Peluang Detail <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
