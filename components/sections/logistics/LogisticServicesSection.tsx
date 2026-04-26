"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LOGISTICS_SERVICES } from "@/constants/logistics";
import { ArrowRight } from "lucide-react";

const LogisticServicesSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="section-title text-foreground">
            {LOGISTICS_SERVICES.heading}
          </h2>
          <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
            {LOGISTICS_SERVICES.subtext}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {LOGISTICS_SERVICES.items.map((item, index) => (
            <div
              key={index}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/5"
            >
              {/* Image Container */}
              <div className="relative aspect-16/10 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <h3 className="mb-3 text-heading-3 text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="mb-6 flex-1 text-body-sm text-muted-foreground sm:text-body">
                  {item.description}
                </p>

                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-body-sm font-bold text-primary transition-colors hover:text-primary/80"
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

export default LogisticServicesSection;
