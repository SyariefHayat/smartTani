"use client";

import React from "react";
import Image from "next/image";
import { LOGISTIC_MITRA } from "@/constants/logistic";

const MitraTransportasiSection = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold text-[#17391f] md:text-4xl">
            {LOGISTIC_MITRA.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium text-[#5d7a64] md:text-lg">
            {LOGISTIC_MITRA.subtext}
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 xl:gap-4">
          {LOGISTIC_MITRA.items.map((mitra, index) => (
            <div
              key={index}
              className="group relative flex h-24 w-full items-center justify-center grayscale transition-all duration-300 hover:grayscale-0 hover:scale-105"
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

export default MitraTransportasiSection;
