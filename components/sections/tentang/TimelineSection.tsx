import React from "react";
import { ABOUT_TIMELINE } from "@/constants/about";
import {
  Sprout,
  ShoppingCart,
  Truck,
  GraduationCap,
  Users,
  Globe,
} from "lucide-react";

const TIMELINE_ICONS = [
  Sprout,
  ShoppingCart,
  Truck,
  GraduationCap,
  Users,
  Globe,
];

const TimelineSection = () => {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-smarttani">
        <div className="text-center mb-16">
          <h2 className="section-title text-primary">
            {ABOUT_TIMELINE.heading}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {ABOUT_TIMELINE.subtext}
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
            {ABOUT_TIMELINE.items.map((item, index) => {
              const Icon = TIMELINE_ICONS[index] || Sprout;
              return (
                <div key={item.tahun} className="flex flex-col items-center group">
                  {/* Icon Node */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center shadow-sm group-hover:border-primary group-hover:bg-primary transition-all duration-300 z-20 relative">
                      <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                    </div>
                    {/* Pulsing dot for current/latest year */}
                    {index === ABOUT_TIMELINE.items.length - 1 && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping -z-10" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="text-center px-4">
                    <div className="text-2xl font-bold text-primary mb-2">
                      {item.tahun}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.keterangan}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
