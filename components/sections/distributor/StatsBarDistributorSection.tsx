import React from "react";
import { DISTRIBUTOR_STATS_BAR } from "@/constants/distributor";
import { StatItem } from "../beranda/StatItem";
import { Separator } from "@/components/ui/separator";

const StatsBarDistributorSection = () => {
  const total = DISTRIBUTOR_STATS_BAR.length;

  return (
    <section className="relative px-4 sm:px-6 md:px-10 lg:px-12 py-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:p-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 lg:gap-y-0">
          {DISTRIBUTOR_STATS_BAR.map((item, index) => {
            const isLastInRowMobile = (index + 1) % 2 === 0;
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

                {/* Separator vertikal — desktop (6 kolom) */}
                {!isLast && (
                  <Separator
                    orientation="vertical"
                    className="absolute -right-px hidden lg:block h-full bg-slate-200"
                  />
                )}

                {/* Separator vertikal — tablet (3 kolom) */}
                {!isLastInRowTablet && (
                  <Separator
                    orientation="vertical"
                    className="absolute -right-px hidden sm:block lg:hidden h-full bg-slate-200"
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

export default StatsBarDistributorSection;