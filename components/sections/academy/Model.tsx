"use client";

import React from "react";
import { ACADEMY_MODEL_PELATIHAN } from "@/constants/academy";
import { Laptop, Users, Layers, Building, Clock, Target } from "lucide-react";

const ICON_MAP = [Laptop, Users, Layers, Building];

const Model = () => {
  return (
    <section className="section-padding" id="academy-model">
      <div className="container-smarttani">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
            {ACADEMY_MODEL_PELATIHAN.heading}
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-medium text-[#5d7a64] md:text-base">
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
                className="group relative flex flex-col rounded-2xl bg-white p-6 sm:p-7 lg:p-8 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-slate-100"
              >
                {/* Icon Wrapper */}
                <div className="mb-5 md:mb-6 flex size-14 items-center justify-center rounded-xl md:rounded-2xl bg-primary-light text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                  <Icon className="size-7" />
                </div>

                <h3 className="mb-2 md:mb-3 text-lg font-extrabold text-[#17391f] leading-snug">
                  {item.title}
                </h3>

                <p className="mb-6 md:mb-8 text-xs md:text-sm font-medium text-[#5d7a64] flex-1 leading-relaxed">
                  {item.description}
                </p>

                {/* Meta Info */}
                <div className="space-y-3 md:space-y-4 pt-5 md:pt-6 border-t border-slate-100">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="mt-0.5 flex size-5 md:size-6 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <Clock className="size-3 md:size-3.5 text-primary" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-[11px] font-semibold uppercase text-muted-foreground leading-snug">
                        Waktu
                      </p>
                      <p className="text-caption font-extrabold text-[#17391f] leading-tight truncate">
                        {item.waktu}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="mt-0.5 flex size-5 md:size-6 shrink-0 items-center justify-center rounded-full bg-primary-light">
                      <Target className="size-3 md:size-3.5 text-primary" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] md:text-[11px] font-semibold uppercase text-muted-foreground leading-snug">
                        Cocok Untuk
                      </p>
                      <p className="text-caption font-extrabold text-[#17391f] leading-tight">
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

export default Model;
