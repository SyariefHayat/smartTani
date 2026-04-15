import React from "react";
import { DISTRIBUTOR_STEPS } from "@/constants/distributor";

const DistributorStepsSection = () => {
  return (
    <section className="py-16">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {DISTRIBUTOR_STEPS.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {DISTRIBUTOR_STEPS.items.map((item, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DistributorStepsSection;
