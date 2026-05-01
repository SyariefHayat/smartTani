import React from "react";
import { ABOUT_TIMELINE } from "@/constants/about";
import {
  Sprout, ShoppingCart, Truck,
  GraduationCap, Users, Globe,
} from "lucide-react";

const TIMELINE_ICONS = [Sprout, ShoppingCart, Truck, GraduationCap, Users, Globe];

const Timeline = () => {
  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl mb-4">
            {ABOUT_TIMELINE.heading}
          </h2>
          <p className="text-sm md:text-base font-medium text-[#5d7a64] max-w-2xl mx-auto">
            {ABOUT_TIMELINE.subtext}
          </p>
        </div>

        <div className="relative">
          {/* Garis penghubung horizontal (desktop only) */}
          <div className="absolute top-7 left-[5%] right-[5%] h-px bg-slate-200 hidden lg:block z-0" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-10 gap-x-4 lg:gap-x-4 relative z-10">
            {ABOUT_TIMELINE.items.map((item, index) => {
              const Icon = TIMELINE_ICONS[index] || Sprout;
              const isLast = index === ABOUT_TIMELINE.items.length - 1;

              return (
                <div
                  key={item.tahun}
                  className="flex flex-col items-center text-center group px-2 md:px-4"
                >
                  {/* Node ikon */}
                  <div className="relative mb-6">
                    <div className="size-14 rounded-xl bg-[#d4edda] text-[#2D6A2D] flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">
                      <Icon className="size-7" strokeWidth={1.5} />
                    </div>
                    {isLast && (
                      <span className="absolute inset-[-4px] rounded-xl border border-primary/30 animate-ping" />
                    )}
                  </div>

                  {/* Konten */}
                  <div className="flex flex-col items-center">
                    {isLast && (
                      <span className="mb-2 px-2.5 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-wider">
                        Terbaru
                      </span>
                    )}
                    <div className="text-xl font-extrabold text-[#17391f] mb-2">
                      {item.tahun}
                    </div>
                    <p className="text-xs md:text-sm font-medium text-[#5d7a64] leading-relaxed max-w-[160px]">
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

export default Timeline;