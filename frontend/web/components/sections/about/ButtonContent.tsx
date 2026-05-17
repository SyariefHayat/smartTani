import React from 'react';

interface ButtonContentProps {
  icon: React.ElementType;
  prefix: string;
  label: string;
}

export const ButtonContent = ({ icon: Icon, prefix, label }: ButtonContentProps) => (
  <>
    <Icon className="size-7 shrink-0 mr-3" strokeWidth={1.5} />
    <div className="flex flex-col items-start leading-tight">
      <span className="text-[0.65rem] font-normal opacity-80">{prefix}</span>
      <span className="text-sm font-bold">{label}</span>
    </div>
  </>
);
