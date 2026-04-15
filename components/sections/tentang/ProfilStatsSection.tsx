import React from "react";
import { ABOUT_DESKRIPSI, ABOUT_STATS_BAR } from "@/constants/about";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Users,
  Store,
  MapPin,
  GraduationCap,
} from "lucide-react";

const STAT_ICONS = [
  CalendarDays,
  Users,
  Store,
  MapPin,
  GraduationCap,
];

const ProfilStatsSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Description Content */}
          <div className="lg:col-span-5">
            <h2 className="text-heading-2 text-foreground mb-6">
              {ABOUT_DESKRIPSI.heading}
            </h2>
            <p className="text-body text-muted-foreground mb-8 text-justify">
              {ABOUT_DESKRIPSI.content}
            </p>
            <Button
              variant="default"
              className="bg-primary hover:bg-primary-dark rounded-lg font-semibold px-6"
            >
              {ABOUT_DESKRIPSI.cta}
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {ABOUT_STATS_BAR.map((stat, index) => {
                const Icon = STAT_ICONS[index] || Users;
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilStatsSection;
