"use client";

import React from "react";
import { LOGISTIC_STEPS } from "@/constants/logistic";
import { 
  ClipboardList, 
  Package, 
  Warehouse, 
  Truck, 
  MapPin, 
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const STEP_ICONS = [
  ClipboardList,
  Package,
  Warehouse,
  Truck,
  MapPin,
  CheckCircle2
];

const AlurPengirimanSection = () => {
  return (
    <section className="py-20 bg-slate-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="rounded-[40px] bg-white border border-slate-100 p-8 shadow-sm sm:p-12 md:p-16">
          {/* Header */}
          <div className="mb-16 flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold text-[#17391f] md:text-4xl">
              {LOGISTIC_STEPS.heading}
            </h2>
            <p className="mt-4 text-sm font-medium text-[#5d7a64] md:text-base">
              6 langkah mudah pengiriman terintegrasi Smarttani
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-4">
            {LOGISTIC_STEPS.items.map((step, index) => {
              const Icon = STEP_ICONS[index] || Package;
              return (
                <div key={index} className="relative flex flex-col items-center text-center xl:items-start xl:text-left">
                  {/* Step Number & Icon */}
                  <div className="mb-6 flex items-center gap-4 xl:mb-4">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-lg shadow-primary/20">
                      {step.step}
                    </div>
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="size-8" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col">
                    <h3 className="mb-2 text-base font-bold text-[#17391f] sm:text-lg lg:text-base xl:text-lg">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#5d7a64]">
                      {step.description}
                    </p>
                  </div>

                  {/* Desktop Connector */}
                  {index < LOGISTIC_STEPS.items.length - 1 && (
                    <div className="absolute left-[80%] top-10 hidden w-[40%] xl:block">
                      <div className="h-px w-full border-t border-dashed border-primary/30" />
                    </div>
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

export default AlurPengirimanSection;
