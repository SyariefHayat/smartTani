'use client';

import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EntryFooterProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onSaveDraft?: () => void;
  isSubmitting?: boolean;
}

export function EntryFooter({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  onSaveDraft,
  isSubmitting = false,
}: EntryFooterProps) {
  const isLastStep = currentStep === totalSteps;

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={onBack} className="px-5 gap-1.5">
            <ArrowLeft className="w-4 h-4" /> Kembali
          </Button>
        )}
        <Button type="button" variant="ghost" className="px-5 text-slate-500 hover:text-slate-700">
          Batal
        </Button>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSubmitting}
          className="px-5 gap-1.5"
        >
          <Save className="w-4 h-4" /> Simpan Draft
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="gap-2 px-6 font-semibold"
        >
          {isLastStep ? 'Terbitkan Produk' : 'Lanjutkan'}
          {!isLastStep && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
