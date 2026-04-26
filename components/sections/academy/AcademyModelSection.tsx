"use client";

import React from "react";
import { ACADEMY_MODEL_PELATIHAN } from "@/constants/academy";
import { Laptop, Users, Layers, Building, Clock, Target } from "lucide-react";

const ICON_MAP = [Laptop, Users, Layers, Building];

const AcademyModelSection = () => {
  return (
    <section className="section-padding bg-slate-50" id="academy-model">
      <div className="container-smarttani">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col items-center text-center">
          <h2 className="text-heading-2 font-bold text-foreground">
            {ACADEMY_MODEL_PELATIHAN.heading}
          </h2>
          <div className="mt-3 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-4 max-w-2xl text-caption md:text-body-sm text-muted-foreground">
            {ACADEMY_MODEL_PELATIHAN.subtext}
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {ACADEMY_MODEL_PELATIHAN.items.map((item, index) => {
            const Icon = ICON_MAP[index] || Laptop;
            return (
              <div
                key={item.title}
                className="group relative flex flex-col rounded-2xl bg-white p-5 sm:p-6 lg:p-8 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-100"
              >
                {/* Icon Wrapper */}
                <div className="mb-4 md:mb-6 flex size-10 md:size-14 items-center justify-center rounded-xl md:rounded-2xl bg-primary-light text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                  <Icon className="size-5 md:size-7" strokeWidth={1.5} />
                </div>

                <h3 className="mb-2 md:mb-3 text-sm md:text-heading-3 font-semibold text-foreground leading-snug">
                  {item.title}
                </h3>

                <p className="mb-4 md:mb-6 text-xs md:text-body-sm text-muted-foreground flex-1 leading-relaxed">
                  {item.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 md:space-y-3 pt-4 md:pt-5 border-t border-slate-100">
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="mt-0.5 flex size-4 md:size-5 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <Clock className="size-2.5 md:size-3 text-primary" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
                        Waktu
                      </p>
                      <p className="text-[11px] md:text-caption font-bold text-foreground leading-tight truncate">
                        {item.waktu}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 md:gap-3">
                    <div className="mt-0.5 flex size-4 md:size-5 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <Target className="size-2.5 md:size-3 text-primary" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground mb-0.5">
                        Cocok Untuk
                      </p>
                      <p className="text-[11px] md:text-caption font-bold text-foreground leading-tight">
                        {item.cocokUntuk}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AcademyModelSection;
