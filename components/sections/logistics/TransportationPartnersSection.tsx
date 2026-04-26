"use client";

import React from "react";
import Image from "next/image";
import { LOGISTICS_PARTNERS } from "@/constants/logistics";

const TransportationPartnersSection = () => {
  return (
    <section className="section-padding bg-white overflow-hidden">
      <div className="container-smarttani">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="section-title text-foreground">
            {LOGISTICS_PARTNERS.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
            {LOGISTICS_PARTNERS.subtext}
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 xl:gap-4">
          {LOGISTICS_PARTNERS.items.map((mitra, index) => (
            <div
              key={index}
              className="relative flex h-24 w-full items-center justify-center"
            >
              <div className="relative h-12 w-32 sm:h-14 sm:w-36 lg:h-16 lg:w-40 xl:h-14 xl:w-32">
                <Image
                  src={mitra.logo}
                  alt={mitra.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TransportationPartnersSection;
