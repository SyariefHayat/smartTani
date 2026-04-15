import React from "react";
import { DISTRIBUTOR_STATS_BAR } from "@/constants/distributor";

const DistributorStatsBarSection = () => {
  return (
    <section className="bg-gray-50 py-10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {DISTRIBUTOR_STATS_BAR.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DistributorStatsBarSection;
