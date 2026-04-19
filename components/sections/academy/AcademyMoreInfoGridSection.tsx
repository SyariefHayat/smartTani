"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ACADEMY_WEBINAR,
  ACADEMY_CTA_BANNER
} from "@/constants/sitani-academy";
import { ARTICLE_DUMMY } from "@/constants/article";
import {
  MoveRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const AcademyMoreInfoGridSection = () => {
  const webinars = ACADEMY_WEBINAR.items.slice(0, 2);
  const articles = ARTICLE_DUMMY.slice(0, 2);

  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Webinar & Event Section */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-body font-bold text-foreground">
                  Webinar &amp; Event
                </h3>
                <p className="text-caption text-muted-foreground mt-1">
                  Belajar langsung dari para ahli di acara spesial kami.
                </p>
              </div>
              <Link href="/academy/webinar" className="text-caption font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap mb-1">
                Lihat Semua <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {webinars.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="relative size-14 shrink-0 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-caption font-bold text-foreground line-clamp-1 mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-caption text-muted-foreground">
                      {item.tanggal} • {item.waktu.split(' - ')[0]}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="h-7 px-3 text-caption border-primary text-primary hover:bg-primary !hover:text-white rounded-md shrink-0">
                    Daftar
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Artikel Terbaru Section */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h3 className="text-body font-bold text-foreground">
                  Artikel Terbaru
                </h3>
                <p className="text-caption text-muted-foreground mt-1">
                  Insights &amp; tips terbaru untuk petani modern.
                </p>
              </div>
              <Link href="/artikel" className="text-caption font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap mb-1">
                Lihat Semua <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-4">
              {articles.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="relative size-14 shrink-0 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-caption font-bold text-foreground line-clamp-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-caption text-muted-foreground mt-1">
                      {item.tanggal}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner Section */}
          <div className="lg:col-span-4 relative overflow-hidden bg-cta-gradient rounded-2xl p-6 sm:p-8 flex flex-col text-white h-full">
            <h3 className="text-body font-bold text-white mb-3 leading-tight relative z-10">
              {ACADEMY_CTA_BANNER.heading}
            </h3>
            <p className="text-caption text-white/80 mb-8 leading-relaxed relative z-10">
              {ACADEMY_CTA_BANNER.subtext}
            </p>

            <div className="mt-auto flex flex-col sm:flex-row gap-3 relative z-10">
              <Button
                asChild
                className="w-full sm:flex-1 bg-primary hover:bg-primary/80 !text-white text-caption font-bold h-11 rounded-lg border-none shadow-sm shadow-black/5"
              >
                <Link href="/sitani-academy">{ACADEMY_CTA_BANNER.cta[0].label}</Link>
              </Button>
              <Button
                asChild
                className="w-full sm:flex-1 bg-accent hover:bg-accent/90 !text-white text-caption font-bold h-11 rounded-lg border-none shadow-sm shadow-black/5"
              >
                <Link href="/signup">{ACADEMY_CTA_BANNER.cta[1].label}</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AcademyMoreInfoGridSection;
