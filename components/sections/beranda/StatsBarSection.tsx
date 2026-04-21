"use client";

import { UsersRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { HOME_STATS_BAR, STAT_BAR_ICONS } from "@/constants";
import { StatItem } from "./StatItem";

export default function StatsBarSection() {
  return (
    <section className="section-padding relative px-5 sm:px-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-3 md:grid-cols-6 py-8 md:px-4 lg:px-0 gap-y-8 md:gap-y-0 items-start">
          {HOME_STATS_BAR.map((item, index) => {
            const Icon = STAT_BAR_ICONS[index] ?? UsersRound;
            const isLastInMobileRow = index === 2;
            const isLastOverall = index === HOME_STATS_BAR.length - 1;

            return (
              <div
                key={item.label}
                className="relative flex flex-col items-center px-4"
              >
                <StatItem icon={Icon} value={item.value} label={item.label} />

                {!isLastOverall && (
                  <Separator
                    orientation="vertical"
                    className={[
                      "absolute -right-px h-full top-0 bg-slate-200",
                      isLastInMobileRow ? "hidden" : "block",
                      "md:hidden lg:block",
                    ].join(" ")}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}