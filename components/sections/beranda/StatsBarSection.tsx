"use client";

import { UsersRound } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { HOME_STATS_BAR, STAT_BAR_ICONS } from "@/constants";
import { StatItem } from "./StatItem";

export default function StatsBarSection() {
  const total = HOME_STATS_BAR.length;

  return (
    <section className="section-padding relative px-5 sm:px-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:p-8">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0">
          {HOME_STATS_BAR.map((item, index) => {
            const Icon = STAT_BAR_ICONS[index] ?? UsersRound;
            return (
              <div
                key={item.label}
                className="relative flex items-center justify-center"
              >
                <StatItem icon={Icon} value={item.value} label={item.label} />

                {index < HOME_STATS_BAR.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="absolute -right-px hidden h-full self-center lg:block bg-slate-200"
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