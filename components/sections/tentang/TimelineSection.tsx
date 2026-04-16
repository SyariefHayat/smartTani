import React from "react";
import { ABOUT_TIMELINE } from "@/constants/about";
import {
  Sprout, ShoppingCart, Truck,
  GraduationCap, Users, Globe,
} from "lucide-react";

const TIMELINE_ICONS = [Sprout, ShoppingCart, Truck, GraduationCap, Users, Globe];

const TimelineSection = () => {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-smarttani">
        <div className="text-center mb-16">
          <h2 className="section-title text-primary">{ABOUT_TIMELINE.heading}</h2>
          <p className="section-subtitle max-w-2xl mx-auto">{ABOUT_TIMELINE.subtext}</p>
        </div>

        <div className="relative">
          {/* Garis horizontal (desktop) */}
          <div className="absolute top-7 left-[8%] w-[84%] h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent hidden lg:block" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-0 relative z-10">
            {ABOUT_TIMELINE.items.map((item, index) => {
              const Icon = TIMELINE_ICONS[index] || Sprout;
              const isLast = index === ABOUT_TIMELINE.items.length - 1;

              return (
                <div
                  key={item.tahun}
                  className="flex flex-col items-center text-center px-4 pb-8 group"
                >
                  {/* Node ikon */}
                  <div className="relative mb-5">
                    <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-300 shadow-sm">
                      <Icon className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors duration-300" />
                    </div>
                    {isLast && (
                      <span className="absolute inset-[-4px] rounded-full border border-primary/40 animate-ping" />
                    )}
                  </div>

                  {/* Konten */}
                  <div>
                    {isLast && (
                      <span className="inline-block text-caption font-medium px-2.5 py-0.5 rounded-full bg-primary/10 text-primary mb-2">
                        Terkini
                      </span>
                    )}
                    <div className="text-body-lg font-semibold text-primary mb-2 tracking-tight">
                      {item.tahun}
                    </div>
                    <p className="text-caption text-muted-foreground max-w-[160px] mx-auto">
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