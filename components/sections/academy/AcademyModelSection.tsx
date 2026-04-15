"use client";

import React from "react";
import { ACADEMY_MODEL_PELATIHAN } from "@/constants/sitani-academy";
import { Laptop, Users, Layers, Building, Clock, Target } from "lucide-react";

const ICON_MAP = [Laptop, Users, Layers, Building];

const AcademyModelSection = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="container-smarttani mx-auto px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold text-[#17391f] md:text-4xl">
            {ACADEMY_MODEL_PELATIHAN.heading}
          </h2>
          <div className="mt-4 h-1.5 w-20 rounded-full bg-primary" />
          <p className="mt-6 max-w-2xl text-base font-medium text-[#5d7a64] md:text-lg">
            {ACADEMY_MODEL_PELATIHAN.subtext}
          </p>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {ACADEMY_MODEL_PELATIHAN.items.map((item, index) => {
            const Icon = ICON_MAP[index] || Laptop;
            return (
              <div
                key={item.title}
                className="group relative flex flex-col rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-100"
              >
                {/* Icon Wrapper */}
                <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                  <Icon className="size-8" strokeWidth={1.5} />
                </div>

                <h3 className="mb-4 text-xl font-bold text-[#17391f]">
                  {item.title}
                </h3>
                
                <p className="mb-8 text-sm leading-relaxed text-[#5d7a64] flex-1">
                  {item.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-5 items-center justify-center rounded-full bg-primary/10">
                      <Clock className="size-3 text-primary" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-0.5">Waktu</p>
                      <p className="text-xs font-bold text-[#17391f] leading-tight">{item.waktu}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 flex size-5 items-center justify-center rounded-full bg-primary/10">
                      <Target className="size-3 text-primary" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-slate-400 mb-0.5">Cocok Untuk</p>
                      <p className="text-xs font-bold text-[#17391f] leading-tight">{item.cococokUntuk || item.cocokUntuk}</p>
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
