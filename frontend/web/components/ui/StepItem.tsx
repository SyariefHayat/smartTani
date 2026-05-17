'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface StepItemProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function StepItem({ step, icon, title, description, className }: StepItemProps) {
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <div className="mb-4 relative">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
          {icon}
        </div>
        <div className="absolute -top-1.5 -left-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold shadow-sm">
          {step}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <h3 className="text-base font-extrabold text-[#17391f] md:text-lg">{title}</h3>
        <p className="max-w-[200px] text-xs leading-relaxed text-[#5d7a64] md:text-sm">
          {description}
        </p>
      </div>
    </div>
  );
}
