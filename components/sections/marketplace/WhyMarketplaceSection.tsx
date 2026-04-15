"use client";

import React from "react";
import {
  ShieldCheck,
  ShoppingCart,
  Lock,
  Truck,
  Headphones,
} from "lucide-react";
import { MARKETPLACE_WHY } from "@/constants/marketplace";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const WHY_ICONS = [ShieldCheck, ShoppingCart, Lock, Truck, Headphones];

const WhyMarketplaceSection = () => {
  const { heading, items } = MARKETPLACE_WHY;

  return (
    <section className="container-smarttani mb-8">
      <div className="bg-[#E6E6E6] rounded-lg p-8">
        {/* Heading */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#1a3a22]">
            {heading}
          </h2>
        </div>

        {/* Content Container */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-y-10 md:gap-y-12 lg:gap-y-0">
          {items.map((item, index) => {
            const Icon = WHY_ICONS[index];
            const isLast = index === items.length - 1;

            return (
              <div
                key={item.title}
                className={cn(
                  "flex flex-col items-center text-center px-4 relative",
                  // Mobile (grid-cols-2): 2-2-1
                  index === 4
                    ? "col-span-2 md:col-span-3 lg:col-span-1"
                    : "col-span-1 md:col-span-2 lg:col-span-1",
                  // Tablet (grid-cols-6): 3-2
                  index === 3 && "md:col-span-3 lg:col-span-1",
                )}
              >
                {/* Icon */}
                <div className="size-12 md:size-14 flex items-center justify-center mb-4 text-[#2c6e3e]">
                  <Icon className="size-8 md:size-9 stroke-[1.5]" />
                </div>

                {/* Text Content */}
                <h3 className="text-sm md:text-base font-bold text-[#1a3a22] mb-2">
                  {item.title}
                </h3>
                <p className="text-[11px] md:text-xs text-[#5d7a64] leading-relaxed max-w-45">
                  {item.description}
                </p>

                {/* Vertical Separator (Desktop Only) */}
                {!isLast && (
                  <div className="hidden lg:block absolute -right-[0.5px] top-1/2 -translate-y-1/2 h-20">
                    <Separator
                      orientation="vertical"
                      className="bg-[#d1d5d1]"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyMarketplaceSection;
