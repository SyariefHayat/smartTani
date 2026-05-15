'use client';

import { Proposal } from '@/services/investment';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, TrendingUp } from 'lucide-react';
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
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {proposal.commodity}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            {proposal.location.city}
          </div>
        </div>
        <CardTitle className="text-lg font-bold line-clamp-2 leading-tight">
          {proposal.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-600">Dana Terkumpul</span>
            <span className="font-bold text-green-600">{raisedPercent}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-600 transition-all duration-500" 
              style={{ width: `${raisedPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1.5">
            <span className="font-bold text-gray-900">
              Rp {Number(proposal.funding_raised).toLocaleString('id-ID')}
            </span>
            <span className="text-gray-500">
              dari Rp {Number(proposal.funding_needed).toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
            <div className="flex items-center text-[10px] text-gray-500 mb-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              PROYEKSI ROI
            </div>
            <p className="text-sm font-bold text-green-700">
              {proposal.projected_roi_percent}%
            </p>
          </div>
          <div className="bg-gray-50 p-2 rounded-lg border border-gray-100">
            <div className="flex items-center text-[10px] text-gray-500 mb-1">
              <Calendar className="w-3 h-3 mr-1" />
              DURASI
            </div>
            <p className="text-sm font-bold text-gray-900">
              {proposal.duration_days} Hari
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Link href={`/invest/${proposal.id}`} className="w-full">
          <Button className="w-full bg-green-600 hover:bg-green-700 font-bold">
            Lihat Detail
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
