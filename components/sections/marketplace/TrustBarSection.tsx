"use client";

import { Lock, BadgeCheck, Zap, Headphones } from "lucide-react";
import { MARKETPLACE_TRUST_BAR } from "@/constants/marketplace";

const TRUST_ICONS = [Lock, BadgeCheck, Zap, Headphones];

const TrustBarSection = () => {
  return (
    <div className="bg-[#E6E6E6] rounded-xl p-6 md:p-8 my-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 lg:gap-y-0">
        {MARKETPLACE_TRUST_BAR.map((item, index) => {
          const Icon = TRUST_ICONS[index];
          return (
            <div
              key={item.label}
              className="relative flex items-center justify-center lg:justify-start px-2"
            >
              <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 text-center md:text-left">
                {/* Icon Container */}
                <div className="flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 text-primary shrink-0">
                  <Icon className="size-5 md:size-6" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col">
                  <h3 className="text-xs md:text-sm font-bold text-[#17391f] leading-tight">
                    {item.label}
                  </h3>
                  <p className="text-[10px] md:text-xs text-[#5d7a64] font-medium mt-0.5">
                    {item.sublabel}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustBarSection;
