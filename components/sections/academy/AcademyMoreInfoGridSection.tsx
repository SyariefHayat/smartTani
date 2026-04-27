"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ACADEMY_WEBINARS,
  ACADEMY_CTA_BANNER
} from "@/constants/academy";
import { ARTICLE_ITEMS } from "@/constants/article";
import { Button } from "@/components/ui/button";

const AcademyMoreInfoGridSection = () => {
  const webinars = ACADEMY_WEBINARS.items.slice(0, 2);
  const articles = ARTICLE_ITEMS.slice(0, 2);

  return (
    <section className="mb-10 bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10 items-stretch">

          {/* Webinar & Event Section */}
          <div className="md:col-span-1 lg:col-span-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-[#17391f] md:text-3xl lg:text-lg">
                  Webinar &amp; Event
                </h3>
                <p className="text-xs md:text-base lg:text-xs font-medium text-[#5d7a64] mt-0.5">
                  Belajar langsung dari para ahli.
                </p>
              </div>
              <Link
                href="/academy/webinar"
                className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {webinars.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-[#EAF3DE]/40 p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-gray-300 flex-1">
                  <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-white shadow-sm">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-[#17391f] line-clamp-1 mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-medium text-[#5d7a64]">
                      {item.tanggal} • {item.waktu.split(' - ')[0]}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 px-4 text-xs font-bold border-primary text-primary hover:bg-primary hover:text-white rounded-lg shrink-0 transition-all">
                    Daftar
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Artikel Terbaru Section */}
          <div className="md:col-span-1 lg:col-span-4 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-extrabold text-[#17391f] md:text-3xl lg:text-lg">
                  Artikel Terbaru
                </h3>
                <p className="text-xs md:text-base lg:text-xs font-medium text-[#5d7a64] mt-0.5">
                  Insights untuk petani modern.
                </p>
              </div>
              <Link
                href="/articles"
                className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="flex flex-col gap-4 flex-1">
              {articles.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-[#EAF3DE]/40 p-4 rounded-xl border border-gray-100 shadow-sm transition-all hover:border-gray-300 flex-1">
                  <div className="relative size-16 shrink-0 rounded-lg overflow-hidden border border-white shadow-sm">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-[#17391f] line-clamp-2 leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-medium text-[#5d7a64] mt-1.5">
                      {item.tanggal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner Section */}
          <div className="md:col-span-1 lg:col-span-4 relative overflow-hidden bg-[#1a4d2e] rounded-3xl p-8 sm:p-10 flex flex-col text-white h-full shadow-xl shadow-primary/10">

            {/* Background Picture */}
            <div className="absolute inset-0 z-0">
              <picture>
                <source
                  media="(min-width: 1024px)"
                  srcSet="/images/home/cta-desktop.webp"
                />
                <source
                  media="(min-width: 640px)"
                  srcSet="/images/home/cta-tablet.png"
                />
                <img
                  src="/images/home/cta-mobile.png"
                  alt="CTA Background"
                  className="h-full w-full object-cover object-center"
                />
              </picture>
            </div>

            <h3 className="text-xl font-extrabold text-white mb-4 leading-tight relative z-10">
              {ACADEMY_CTA_BANNER.heading}
            </h3>
            <p className="text-sm font-medium text-white/90 mb-10 leading-relaxed relative z-10">
              {ACADEMY_CTA_BANNER.subtext}
            </p>

            <div className="mt-auto flex flex-col sm:flex-row gap-4 relative z-10">
              <Button
                asChild
                className="w-full sm:flex-1 bg-white hover:bg-white/90 !text-primary text-xs font-extrabold h-12 rounded-xl border-none shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Link href="/academy">{ACADEMY_CTA_BANNER.cta[0].label}</Link>
              </Button>
              <Button
                asChild
                className="w-full sm:flex-1 bg-accent hover:bg-accent/90 !text-white text-xs font-extrabold h-12 rounded-xl border-none shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Link href="/register">{ACADEMY_CTA_BANNER.cta[1].label}</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AcademyMoreInfoGridSection;