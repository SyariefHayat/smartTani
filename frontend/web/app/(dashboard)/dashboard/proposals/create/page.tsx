'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { investmentService } from '@/services/investment';
import { ProposalForm, ProposalFormValues } from '@/components/features/investment/ProposalForm';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateProposalPage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: async ({ values, action }: { values: ProposalFormValues; action: 'draft' | 'submit' }) => {
      // 1. Create the proposal (backend defaults status to 'draft')
      const response = await investmentService.createProposal({
        ...values,
        harvest_date_estimated: new Date(values.harvest_date_estimated).toISOString(),
      });
      
      const proposalId = response.data.id;

      // 2. If action is 'submit', call submit endpoint
      if (action === 'submit') {
        await investmentService.submitProposal(proposalId);
      }

      return response.data;
    },
    onSuccess: (_, variables) => {
      const isSubmit = variables.action === 'submit';
      toast.success(isSubmit ? 'Proposal Disubmit' : 'Draft Disimpan', {
        description: isSubmit 
          ? 'Proposal Anda telah dikirim ke admin untuk direview.' 
          : 'Proposal Anda telah disimpan sebagai draft.',
      });
      router.push('/dashboard/proposals');
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || 'Gagal memproses proposal';
      toast.error('Gagal', { description: message });
    },
  });

  const handleSubmit = (values: ProposalFormValues, action: 'draft' | 'submit') => {
    createMutation.mutate({ values, action });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Link 
        href="/dashboard/proposals" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Kembali ke Daftar Proposal
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buat Proposal Investasi</h1>
        <p className="text-gray-500 mt-1">Lengkapi data proyek pertanian Anda untuk mendapatkan pendanaan.</p>
      </div>

      <ProposalForm 
        onSubmit={handleSubmit} 
        isSubmitting={createMutation.isPending} 
      />
    </div>
  );
}
