"use client";

import React from "react";
import { SHIPPING_FLOW } from "@/constants/logistics";
import {
  ClipboardList,
  Package,
  Warehouse,
  Truck,
  MapPin,
  CheckCircle2,
} from "lucide-react";

const STEP_ICONS = [
  ClipboardList,
  Package,
  Warehouse,
  Truck,
  MapPin,
  CheckCircle2
];

const ShippingFlowSection = () => {
  return (
    <section className="">
      <div className="container-smarttani">
        <div className="rounded-[32px] bg-[#EAF3DE]/40 border border-[#d4edda] p-6 sm:p-8 md:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {SHIPPING_FLOW.heading}
            </h2>
            <p className="mt-1 text-sm font-medium text-[#5d7a64] md:text-base">
              6 langkah mudah pengiriman terintegrasi Smarttani
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-3 gap-6 sm:grid-cols-6 xl:gap-4">
            {SHIPPING_FLOW.items.map((step, index) => {
              const Icon = STEP_ICONS[index] || Package;
              return (
                <div key={index} className="relative flex flex-col items-center text-center">
                  <div className="mb-3 relative">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
                      <Icon className="size-7" />
                    </div>
                    <div className="absolute -top-1.5 -left-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold shadow-sm">
                      {step.step}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="mb-1 text-sm font-extrabold text-[#17391f] leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-[10px] font-medium text-[#5d7a64] leading-relaxed">
                      {step.description}
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

export default ShippingFlowSection;
