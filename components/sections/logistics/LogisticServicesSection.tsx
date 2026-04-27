"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LOGISTICS_SERVICES } from "@/constants/logistics";
import { FEATURES_BG_COLORS } from "@/constants/home";

const LogisticServicesSection = () => {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
            {LOGISTICS_SERVICES.heading}
          </h2>
          <p className="mt-1 text-sm font-medium text-[#5d7a64] md:text-base">
            {LOGISTICS_SERVICES.subtext}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-6 md:gap-10 lg:gap-6 sm:grid-cols-3 lg:grid-cols-6 items-stretch">
          {LOGISTICS_SERVICES.items.map((item, index) => (
            <Link
              key={index}
              href="#"
              className={`flex flex-col h-full p-4 items-center text-center transition-transform hover:-translate-y-1 rounded-xl ${FEATURES_BG_COLORS[index] || "bg-[#EAF3DE]"}`}
            >
              {/* Gambar */}
              <div className="relative w-full size-40 shrink-0 -mt-5 lg:-mt-7">
                <Image
                  src={item.image}
                  alt={`Ikon layanan ${item.title}`}
                  fill
                  className="object-contain"
                  sizes="100%"
                />
              </div>

              <div className="flex flex-col flex-1 items-center -mt-5 md:-mt-3 lg:-mt-7">
                <h3 className="mb-2 md:mb-4 text-sm font-extrabold text-[#17391f] leading-tight">
                  {item.title}
                </h3>
                <p className="text-[10px] leading-relaxed text-[#5d7a64] md:text-xs line-clamp-3 lg:-mt-2">
                  {item.description}
                </p>
              </div>

              <span
                className="mt-4 group flex items-center gap-1.5 text-[10px] font-bold text-primary transition-colors hover:text-primary/80"
              >
                {item.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogisticServicesSection;
