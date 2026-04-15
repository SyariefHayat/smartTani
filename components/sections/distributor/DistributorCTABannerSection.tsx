import React from "react";
import { DISTRIBUTOR_CTA_BANNER } from "@/constants/distributor";

const DistributorCTABannerSection = () => {
  return (
    <section className="bg-green-700 py-16 text-white text-center">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {DISTRIBUTOR_CTA_BANNER.heading}
        </h2>
        <p className="text-xl mb-8 opacity-90">{DISTRIBUTOR_CTA_BANNER.subtext}</p>
        <div className="flex flex-wrap justify-center gap-4">
          {DISTRIBUTOR_CTA_BANNER.cta.map((btn, index) => (
            <button
              key={index}
              className={`px-8 py-3 rounded-full font-semibold ${
                index === 0
                  ? "bg-white text-green-700"
                  : "bg-transparent border-2 border-white text-white"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DistributorCTABannerSection;
