"use client";

import React from "react";
import { ABOUT_STATS_BAR } from "@/constants/about";
import { StatItem } from "../home/StatItem";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Users,
  Store,
  MapPin,
  GraduationCap,
  Package,
} from "lucide-react";

const STAT_ICONS = [
  CalendarDays,
  Users,
  Store,
  MapPin,
  GraduationCap,
  Package,
];

const ProfileStatsSection = () => {
  const total = ABOUT_STATS_BAR.length;

  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 py-8 md:px-4 lg:px-0 gap-y-8 md:gap-y-0 items-start">
            {ABOUT_STATS_BAR.map((item, index) => {
              const Icon = STAT_ICONS[index] || Users;
              const isLastOverall = index === total - 1;
              const isLastInMobileRow = index % 2 === 1;
              const isLastInTabletRow = index % 3 === 2;

              return (
                <div
                  key={item.label}
                  className="relative flex flex-col items-center px-4"
                >
                  <StatItem icon={Icon} value={item.value} label={item.label} />

                  {!isLastOverall && (
                    <Separator
                      orientation="vertical"
                      className={cn(
                        "absolute -right-px h-full top-0 bg-slate-200",
                        isLastInMobileRow ? "hidden" : "block",
                        isLastInTabletRow ? "md:hidden" : "md:block",
                        "lg:block"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileStatsSection;
