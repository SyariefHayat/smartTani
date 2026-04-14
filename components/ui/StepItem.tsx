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
    <div className="flex items-start gap-3 relative group">
      {/* Number Badge */}
      <div className="flex-shrink-0 w-[28px] h-[28px] rounded-full bg-[#1e5c1e] text-white font-bold flex items-center justify-center text-[13px] mt-1">
        {step}
      </div>

      {/* Icon Area */}
      <div className="flex-shrink-0 text-[#2d6a2d] w-[48px] h-[48px] flex items-center justify-center">
        {icon}
      </div>

      {/* Text Block */}
      <div className="flex flex-col text-left">
        <h3 className="text-[15px] font-bold text-[#1a3a1a] mb-1 leading-tight">{title}</h3>
        <p className="text-[12px] leading-[1.4] text-[#555] max-w-[120px]">
          {description}
        </p>
      </div>
    </div>
  );
};
