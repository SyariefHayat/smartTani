import React from "react";

interface StepItemProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const StepItem = ({
  step,
  icon,
  title,
  description,
}: StepItemProps) => {
  return (
    <div className="flex items-start gap-4 relative group">
      {/* Icon Area */}
      <div className="flex-shrink-0 relative">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
          {icon}
        </div>
        {/* Number Badge */}
        <div className="absolute -top-2 -left-2 flex size-6 items-center justify-center rounded-full bg-[#1A6B2F] text-white text-[10px] font-bold shadow-sm">
          {step}
        </div>
      </div>

      {/* Text Block */}
      <div className="flex flex-col justify-center">
        <h3 className="text-base font-extrabold text-[#17391f] md:text-lg leading-tight mb-1">{title}</h3>
        <p className="text-xs leading-relaxed text-[#5d7a64] md:text-sm max-w-[200px]">
          {description}
        </p>
      </div>
    </div>
  );
};
