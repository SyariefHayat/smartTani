'use client';

import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEPS } from './schema';

interface EntryStepperProps {
  currentStep: number;
}

export function EntryStepper({ currentStep }: EntryStepperProps) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex min-w-0 items-center gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                  currentStep === step.id
                    ? 'border-green-600 bg-green-600 text-white'
                    : currentStep > step.id
                      ? 'border-green-200 bg-green-50 text-green-600'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                )}
              >
                {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : step.id}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  currentStep === step.id
                    ? 'text-slate-900'
                    : currentStep > step.id
                      ? 'text-slate-700'
                      : 'text-slate-400'
                )}
              >
                {step.title}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'hidden h-px flex-1 xl:block',
                  currentStep > step.id ? 'bg-green-200' : 'bg-slate-200'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
