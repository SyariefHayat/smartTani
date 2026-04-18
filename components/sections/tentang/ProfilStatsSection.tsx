import React from "react";
import { ABOUT_STATS_BAR } from "@/constants/about";
import { StatItem } from "../beranda/StatItem";
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

const ProfilStatsSection = () => {
  const total = ABOUT_STATS_BAR.length;

  return (
    <section className="relative -mt-5 lg:-mt-12 z-20 px-4 sm:px-6 md:px-10 lg:px-12 pb-8">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-8 md:p-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-10 lg:gap-y-0">
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
    </section>
  );
};

export default ProfilStatsSection;
