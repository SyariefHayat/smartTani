"use client";

import React from "react";
import { ARTIKEL_NEWSLETTER } from "@/constants/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const ArtikelNewsletterSection = () => {
  return (
    <section className="bg-[#f8fafc] py-16">
      <div className="container-smarttani px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-sm border border-[#f1f5f9] md:p-12 lg:p-16">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            
            <div className="relative z-10 max-w-xl">
              <h2 className="mb-4 text-2xl font-black text-[#1e3a1f] md:text-3xl">
                {ARTIKEL_NEWSLETTER.heading}
              </h2>
              <p className="mb-8 text-sm font-bold text-[#64748b] md:text-base">
                {ARTIKEL_NEWSLETTER.subtext}
              </p>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  type="email"
                  placeholder={ARTIKEL_NEWSLETTER.inputPlaceholder}
                  className="h-12 flex-1 border-[#f1f5f9] bg-[#f8fafc] px-4 text-sm font-bold text-[#1e3a1f] placeholder:text-[#94a3b8] focus-visible:ring-[#2d7a3a]"
                />
                <Button className="h-12 bg-[#2d7a3a] px-8 font-black text-white hover:bg-[#1e3a1f] transition-all">
                  {ARTIKEL_NEWSLETTER.cta}
                </Button>
              </div>
            </div>

            <div className="relative hidden items-center justify-end lg:flex">
              <div className="relative h-64 w-64">
                <Image
                  src="/images/home/buku-akademi.webp" // Using an existing relevant image as placeholder
                  alt="Newsletter"
                  fill
                  className="object-contain"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtikelNewsletterSection;
