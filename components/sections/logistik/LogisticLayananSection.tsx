"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LOGISTIC_LAYANAN } from "@/constants/logistic";
import { ArrowRight } from "lucide-react";

const LogisticLayananSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-extrabold text-[#17391f] md:text-4xl">
            {LOGISTIC_LAYANAN.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-base font-medium text-[#5d7a64] md:text-lg">
            {LOGISTIC_LAYANAN.subtext}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {LOGISTIC_LAYANAN.items.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="mb-3 text-xl font-bold text-[#17391f] group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mb-6 flex-1 text-sm leading-relaxed text-[#5d7a64] sm:text-base">
                  {item.description}
                </p>

                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-colors hover:text-primary/80"
                >
                  {item.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LogisticLayananSection;
