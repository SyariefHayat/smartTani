"use client";

import { Lock, BadgeCheck, Zap, Headphones } from "lucide-react";
import { MARKETPLACE_TRUST_BAR } from "@/constants/marketplace";

const TRUST_ICONS = [Lock, BadgeCheck, Zap, Headphones];

const TrustBar = () => {
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
                {/* <div className="flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 text-primary shrink-0">
                  <Icon className="size-7" />
                </div> */}

                <div className="mb-1 flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
                  <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
                </div>
                {/* Text Content */}
                <div className="flex flex-col">
                  <h3 className="text-base font-extrabold text-[#17391f] md:text-lg">
                    {item.label}
                  </h3>
                  <p className="max-w-[200px] text-xs leading-relaxed text-[#5d7a64] md:text-sm">
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

export default TrustBar;
