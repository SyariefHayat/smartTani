import React from "react";
import { DISTRIBUTOR_KEUNTUNGAN } from "@/constants/distributor";

const DistributorKeuntunganSection = () => {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {DISTRIBUTOR_KEUNTUNGAN.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DISTRIBUTOR_KEUNTUNGAN.items.map((item, index) => (
            <div key={index} className="p-6 border rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DistributorKeuntunganSection;
