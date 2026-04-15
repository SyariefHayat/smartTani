import React from "react";
import { DISTRIBUTOR_KEUNTUNGAN } from "@/constants/distributor";

const DistributorKeuntunganSection = () => {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl lg:text-4xl">
            {DISTRIBUTOR_KEUNTUNGAN.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-sm font-medium text-[#5d7a64] md:text-base">
            {DISTRIBUTOR_KEUNTUNGAN.subtext}
          </p>
        </div>

        {/* Grid Keuntungan */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-6">
          {DISTRIBUTOR_KEUNTUNGAN.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-center p-5 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 rounded-lg border border-gray-100 bg-[#E6E6E6]"
              >
                {/* Icon Container */}
                <div className="mb-4 flex size-12 items-center justify-center rounded-sm border-2 border-primary/20 bg-white text-primary transition-colors group-hover:bg-primary group-hover:text-white md:size-14">
                  <Icon className="size-6 md:size-7" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <h3 className="mb-2 text-sm font-bold text-[#17391f] md:text-base">
                    {item.title}
                  </h3>
                  <p className="text-[10px] leading-relaxed text-[#5d7a64] sm:text-xs md:text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DistributorKeuntunganSection;
