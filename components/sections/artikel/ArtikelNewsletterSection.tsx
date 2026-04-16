"use client";

import React from "react";
import { ARTIKEL_NEWSLETTER } from "@/constants/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const ArtikelNewsletterSection = () => {
  return (
    <section className="pb-10 md:pb-14">
      <div className="container-smarttani">
        <div className="relative overflow-hidden rounded-2xl bg-[#1a4d2e] p-8 md:p-12 lg:p-16">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home/cta-background-2.webp"
              alt="Background Pattern"
              fill
              className="object-cover object-center opacity-40 lg:opacity-100"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

            {/* Kiri: Heading & Subtext */}
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-4xl mb-4">
                {ARTIKEL_NEWSLETTER.heading}
              </h2>
              <p className="text-sm font-medium text-[#eef8e5]/80 md:text-base">
                {ARTIKEL_NEWSLETTER.subtext}
              </p>
            </div>

            {/* Kanan: Input & Button */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
              <Input
                type="email"
                placeholder={ARTIKEL_NEWSLETTER.inputPlaceholder}
                className="h-12 flex-1 border-white/20 bg-white/10 px-4 text-white placeholder:text-white/60 focus-visible:ring-[#FFB21C]"
              />
              <Button className="h-12 bg-[#FFB21C] px-8 font-bold text-white hover:bg-[#FFB21C]/90 transition-all border-none whitespace-nowrap">
                {ARTIKEL_NEWSLETTER.cta}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtikelNewsletterSection;