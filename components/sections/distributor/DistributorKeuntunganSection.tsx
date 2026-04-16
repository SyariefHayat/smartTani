import React from "react";
import { DISTRIBUTOR_KEUNTUNGAN } from "@/constants/distributor";

const DistributorKeuntunganSection = () => {
  return (
    <section className="">
      <div className="container-smarttani">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-heading-1 text-[#17391f]">
            {DISTRIBUTOR_KEUNTUNGAN.heading}
          </h2>
          <p className="text-body-lg mt-4 max-w-2xl text-[#5d7a64]">
            {DISTRIBUTOR_KEUNTUNGAN.subtext}
          </p>
        </div>

        {/* Grid Keuntungan */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DISTRIBUTOR_KEUNTUNGAN.items.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group flex flex-col items-start p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-2xl border border-slate-200 bg-[#F4F7F4]"
              >
                {/* Icon Container */}
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="size-6" strokeWidth={2} />
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1">
                  <h3 className="mb-3 text-lg font-bold text-[#17391f]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5d7a64]">
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
