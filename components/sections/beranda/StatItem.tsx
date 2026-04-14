import { LucideIcon } from "lucide-react";

interface StatItemProps {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatItem({ icon: Icon, value, label }: StatItemProps) {
  return (
    <div className="flex flex-col items-center text-center px-2 sm:px-4">
      <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#E1F5EE] text-[#0F6E56] md:size-12">
        <Icon className="size-5 md:size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-lg font-extrabold text-[#17391f] md:text-xl lg:text-2xl whitespace-nowrap">
          {value}
        </p>
        <p className="text-[10px] font-medium text-[#5d7a64] sm:text-xs md:text-sm">
          {label}
        </p>
      </div>
    </div>
  );
}
