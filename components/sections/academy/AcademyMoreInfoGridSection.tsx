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
  ArrowRight, 
  MoveRight, 
  Calendar, 
  Clock, 
  User,
  CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AcademyMoreInfoGridSection = () => {
  const webinar = ACADEMY_WEBINAR.items[0];
  const article = ARTICLE_DUMMY[0];

  return (
    <section className="py-12 bg-white">
      <div className="container-smarttani mx-auto px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Webinar Terdekat Section */}
          <div className="bg-[#f8faf9] rounded-2xl p-6 border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#17391f]">
                  Webinar Mendatang
                </h3>
                <p className="text-xs text-[#5d7a64] mt-1">
                  Ikuti sesi diskusi live bersama pakar.
                </p>
              </div>
              <Link href="/academy/webinar" className="text-[10px] font-bold text-[#2e5e3a] flex items-center gap-1 hover:underline whitespace-nowrap">
                Lihat Semua <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="flex flex-col flex-1">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <Image 
                  src={webinar.image} 
                  alt={webinar.title} 
                  fill 
                  className="object-cover"
                />
                <Badge className="absolute left-2 top-2 bg-primary text-[10px] py-0 h-5">
                  {webinar.kategori}
                </Badge>
              </div>
              
              <h4 className="text-sm font-bold text-[#17391f] mb-3 line-clamp-2">
                {webinar.title}
              </h4>

              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-[11px] text-[#5d7a64]">
                  <Calendar className="size-3 text-primary" />
                  {webinar.tanggal}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-[#5d7a64]">
                  <User className="size-3 text-primary" />
                  {webinar.narasumber}
                </div>
              </div>

              <Button asChild size="sm" className="mt-auto w-full bg-[#17391f] hover:bg-[#1a4425] text-xs h-9">
                <Link href="#">Daftar Webinar</Link>
              </Button>
            </div>
          </div>

          {/* Artikel Terbaru Section */}
          <div className="bg-[#f8faf9] rounded-2xl p-6 border border-slate-100 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#17391f]">
                  Artikel & Wawasan
                </h3>
                <p className="text-xs text-[#5d7a64] mt-1">
                  Perdalam pengetahuan dengan artikel ahli.
                </p>
              </div>
              <Link href="/artikel" className="text-[10px] font-bold text-[#2e5e3a] flex items-center gap-1 hover:underline whitespace-nowrap">
                Semua Artikel <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="flex flex-col flex-1">
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                <Image 
                  src={article.image} 
                  alt={article.title} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <h4 className="text-sm font-bold text-[#17391f] mb-2 line-clamp-2">
                {article.title}
              </h4>
              <p className="text-[11px] text-[#5d7a64] line-clamp-2 mb-4">
                {article.description}
              </p>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="relative size-6 rounded-full overflow-hidden">
                    <Image src={article.penulis.avatar} alt={article.penulis.nama} fill className="object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-[#17391f]">{article.penulis.nama}</span>
                </div>
                <span className="text-[10px] text-[#5d7a64]">{article.tanggal}</span>
              </div>
            </div>
          </div>

          {/* CTA Banner Section */}
          <div className="bg-[#17391f] rounded-2xl p-6 flex flex-col text-white">
            <h3 className="text-xl font-bold mb-3 leading-tight">
              {ACADEMY_CTA_BANNER.heading}
            </h3>
            <p className="text-xs text-white/80 mb-6 leading-relaxed">
              {ACADEMY_CTA_BANNER.subtext}
            </p>

            <div className="space-y-3 mb-8">
              {[
                "Akses Selamanya",
                "Sertifikat Digital",
                "Forum Diskusi"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-2">
              <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-9">
                <Link href="#">{ACADEMY_CTA_BANNER.cta[1].label}</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full border-white/20 bg-white/5 hover:bg-white hover:text-[#17391f] text-xs h-9">
                <Link href="#">{ACADEMY_CTA_BANNER.cta[0].label}</Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AcademyMoreInfoGridSection;
