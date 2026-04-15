"use client";

import React from "react";
import { ShieldCheck, Tag, Lock, Zap, Headphones } from "lucide-react";
import { MARKETPLACE_WHY } from "@/constants/marketplace";
import { cn } from "@/lib/utils";

const WHY_THEMES = [
  { icon: ShieldCheck, color: "bg-green-50 text-green-600" },
  { icon: Tag, color: "bg-blue-50 text-blue-600" },
  { icon: Lock, color: "bg-purple-50 text-purple-600" },
  { icon: Zap, color: "bg-orange-50 text-orange-600" },
  { icon: Headphones, color: "bg-pink-50 text-pink-600" },
];

const WhyMarketplaceSection = () => {
  const { heading, items } = MARKETPLACE_WHY;

  return (
    <section className="py-12 bg-white">
      <div className="container-smarttani">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#17391f]">
            {heading}
          </h2>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {items.map((item, index) => {
            const { icon: Icon, color } = WHY_THEMES[index];
            return (
              <div
                key={item.title}
                className="flex flex-col items-center text-center p-6 rounded-xl transition-all duration-300 hover:bg-neutral-50 border border-transparent hover:border-neutral-100"
              >
                {/* Icon Wrapper */}
                <div className={cn(
                  "size-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110",
                  color
                )}>
                  <Icon className="size-7" />
                </div>

                {/* Text Content */}
                <h3 className="text-sm md:text-base font-bold text-[#17391f] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[#5d7a64] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyMarketplaceSection;
