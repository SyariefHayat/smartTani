'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { investmentService, Proposal } from '@/services/investment';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { Loader2, ShieldCheck, Info } from 'lucide-react';

interface InvestmentFormProps {
  proposal: Proposal;
}

export function InvestmentForm({ proposal }: InvestmentFormProps) {
  const [amount, setAmount] = useState<number>(100000);
  const queryClient = useQueryClient();

  const fundingNeeded = Number(proposal.funding_needed);
  const fundingRaised = Number(proposal.funding_raised);
  const remainingFunding = fundingNeeded - fundingRaised;
  const minInvestment = 100000;

  const projectedReturn = amount * (1 + proposal.projected_roi_percent / 100);

  const investMutation = useMutation({
    mutationFn: () => investmentService.createInvestment({
      proposalId: proposal.id,
      amount: amount
    }),
    onSuccess: () => {
      toast.success('Investasi Berhasil', { 
        description: `Anda telah berinvestasi sebesar Rp ${amount.toLocaleString('id-ID')}` 
      });
      queryClient.invalidateQueries({ queryKey: ['proposal', proposal.id] });
      queryClient.invalidateQueries({ queryKey: ['proposals'] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || 'Gagal melakukan investasi';
      toast.error('Gagal', { description: message });
    }
  });

  const handleInvest = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount < minInvestment) {
      toast.error('Gagal', { description: `Minimal investasi adalah Rp ${minInvestment.toLocaleString('id-ID')}` });
      return;
    }

    if (amount > remainingFunding) {
      toast.error('Gagal', { description: `Jumlah investasi melebihi sisa kebutuhan dana (Rp ${remainingFunding.toLocaleString('id-ID')})` });
      return;
    }

    investMutation.mutate();
  };

  return (
    <Card className="sticky top-24 border-green-200 bg-green-50/30">
      <CardHeader>
        <CardTitle className="text-lg">Mulai Investasi</CardTitle>
      </CardHeader>
      <form onSubmit={handleInvest}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-600">Jumlah Investasi (Rp)</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
              <Input
                id="amount"
                type="number"
                min={minInvestment}
                max={remainingFunding}
                step={50000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="pl-10 h-12 text-lg font-bold border-green-200 focus-visible:ring-green-500"
              />
            </div>
            <p className="text-[10px] text-gray-500 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Minimal investasi Rp {minInvestment.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="space-y-3 pt-4 border-t border-green-100">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimasi Pengembalian</span>
              <span className="font-bold text-green-700">Rp {projectedReturn.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Estimasi Keuntungan</span>
              <span className="font-bold text-green-600">+{proposal.projected_roi_percent}%</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 italic">
              <span>*Hasil dapat bervariasi tergantung kondisi panen</span>
            </div>
          </div>

          <div className="bg-white/80 p-3 rounded-lg border border-green-100 space-y-2">
            <div className="flex items-start gap-2 text-xs text-gray-600">
              <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
              <span>Dana Anda dikelola secara transparan oleh petani dan diawasi oleh SmartTani.</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full h-12 bg-green-600 hover:bg-green-700 font-bold text-lg"
            disabled={investMutation.isPending || remainingFunding <= 0}
          >
            {investMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}
            {remainingFunding <= 0 ? 'Pendanaan Selesai' : 'Danai Sekarang'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
