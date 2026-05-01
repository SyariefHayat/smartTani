import React from "react";
import { DISTRIBUTOR_KEUNTUNGAN } from "@/constants/distributor";

const Benefits = () => {
  return (
    <section className="">
      <div className="container-smarttani">
        <div className="rounded-[32px] bg-[#EAF3DE]/40 px-6 py-10 md:px-12 md:py-12">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {DISTRIBUTOR_KEUNTUNGAN.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base max-w-2xl">
              {DISTRIBUTOR_KEUNTUNGAN.subtext}
            </p>
          </div>

          {/* Grid Keuntungan */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 items-stretch">
            {DISTRIBUTOR_KEUNTUNGAN.items.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon Container */}
                  <div className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
                    <Icon className="size-7" strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-base font-extrabold text-[#17391f]">
                      {item.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#5d7a64] md:text-sm">
                      {item.description}
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

export default Benefits;
