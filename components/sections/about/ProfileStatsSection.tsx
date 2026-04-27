"use client";

import React from "react";
import { ABOUT_STATS_BAR } from "@/constants/about";
import { StatItem } from "../home/StatItem";
import { Separator } from "@/components/ui/separator";
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
          <div className="grid grid-cols-2 md:grid-cols-6 py-8 md:px-4 lg:px-0 gap-y-8 md:gap-y-0 items-start">
            {ABOUT_STATS_BAR.map((item, index) => {
              const Icon = STAT_ICONS[index] || Users;

              const showDesktopSep = index < total - 1;

              const colPosTablet = index % 3;
              const showTabletSep = colPosTablet !== 2 && index < total - 1;

              const colPosMobile = index % 2;
              const showMobileSep = colPosMobile !== 1 && index < total - 1;

              return (
                <div
                  key={item.label}
                  className="relative flex items-center justify-center py-2 lg:py-0"
                >
                  <StatItem icon={Icon} value={item.value} label={item.label} />

                  {/* Separator vertikal — desktop */}
                  {showDesktopSep && (
                    <Separator
                      orientation="vertical"
                      className="absolute -right-px hidden lg:block h-full bg-slate-200"
                    />
                  )}

                  {/* Separator vertikal — tablet */}
                  {showTabletSep && (
                    <Separator
                      orientation="vertical"
                      className="absolute -right-px hidden sm:block lg:hidden h-full bg-slate-200"
                    />
                  )}

                  {/* Separator vertikal — mobile */}
                  {showMobileSep && (
                    <Separator
                      orientation="vertical"
                      className="absolute -right-px block sm:hidden h-full bg-slate-200"
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
