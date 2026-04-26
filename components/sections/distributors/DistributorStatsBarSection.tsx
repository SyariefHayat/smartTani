"use client";

import React from "react";
import { DISTRIBUTOR_STATS_BAR } from "@/constants/distributor";
import { StatItem } from "../home/StatItem";
import { Separator } from "@/components/ui/separator";

const DistributorStatsBarSection = () => {
  const total = DISTRIBUTOR_STATS_BAR.length;

  return (
    <section className="relative z-20 px-4 sm:px-6 md:px-10 lg:px-12 -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:p-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 lg:gap-y-0">
          {DISTRIBUTOR_STATS_BAR.map((item, index) => {
            const isLastInRowTablet = (index + 1) % 3 === 0;
            const isLast = index === total - 1;

            return (
              <div
                key={item.label}
                className="relative flex items-center justify-center py-2 lg:py-0"
              >
                <StatItem
                  icon={item.icon}
                  value={item.value}
                  label={item.label}
                />

                {/* Separator — desktop */}
                {!isLast && (
                  <Separator
                    orientation="vertical"
                    className="absolute -right-px hidden lg:block h-full self-center bg-slate-200"
                  />
                )}

                {/* Separator — tablet */}
                {!isLastInRowTablet && (
                  <Separator
                    orientation="vertical"
                    className="absolute -right-px hidden sm:block lg:hidden h-full self-center bg-slate-200"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DistributorStatsBarSection;