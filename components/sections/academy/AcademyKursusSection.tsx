"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ACADEMY_KURSUS } from "@/constants/sitani-academy";
import { Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AcademyKursusSection = () => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-smarttani mx-auto px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#17391f] md:text-3xl">
              {ACADEMY_KURSUS.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64]">
              {ACADEMY_KURSUS.subtext}
            </p>
          </div>
          <Link
            href="#"
            className="group flex items-center gap-2 text-sm font-bold text-primary transition-all hover:text-primary/80"
          >
            Lihat Semua Kursus
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Kursus Grid - Adjusted to 6 columns on large screens as per screenshot */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {ACADEMY_KURSUS.items.map((kursus, index) => {
            // Determine badge color based on text
            const isOrangeBadge = 
              kursus.badge === "BEST SELLER" || 
              kursus.badge === "BARU" || 
              kursus.badge === "HOT";
            
            return (
              <div
                key={kursus.title}
                className="group flex flex-col rounded-xl bg-white border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
              >
                {/* Image & Badge Wrapper */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={kursus.image}
                    alt={kursus.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {kursus.badge && (
                    <Badge className={`absolute left-2 top-2 px-2 py-0.5 text-[10px] font-bold border-none shadow-sm rounded ${
                      isOrangeBadge ? "bg-orange-500 text-white" : "bg-[#2d7a3c] text-white"
                    }`}>
                      {kursus.badge}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="mb-2 text-sm font-bold text-[#17391f] line-clamp-2 min-h-[2.5rem]">
                    {kursus.title}
                  </h3>

                  <p className="mb-4 text-[11px] leading-relaxed text-[#5d7a64] line-clamp-2">
                    {kursus.description}
                  </p>

                  {/* Instructor - Compact */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="relative size-8 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-100">
                      {/* Using first letter as fallback for avatar if image not provided in constants */}
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] font-bold text-slate-400">
                        {kursus.instruktur.nama.charAt(0)}
                      </div>
                      <Image
                        src={`/images/about/pimpinan-${kursus.instruktur.nama.toLowerCase().split(' ').pop()}.jpeg`}
                        alt={kursus.instruktur.nama}
                        fill
                        className="object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-[#17391f]">
                        {kursus.instruktur.nama}
                      </p>
                      <p className="truncate text-[9px] font-medium text-[#5d7a64]">
                        {kursus.instruktur.gelar}
                      </p>
                    </div>
                  </div>

                  {/* Rating & Review Count */}
                  <div className="mb-4 flex items-center gap-1.5 text-[11px] font-bold">
                    <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-yellow-600">{kursus.rating}</span>
                    <span className="text-slate-400 font-medium">({kursus.ulasan.toLocaleString('id-ID')})</span>
                  </div>

                  {/* Mode & Duration Tags */}
                  <div className="mt-auto mb-4 flex items-center justify-between gap-2">
                    <div className={`px-3 py-1 text-[10px] font-bold rounded border ${
                      kursus.mode === "Online" 
                        ? "bg-green-50 text-[#2d7a3c] border-green-200" 
                        : kursus.mode === "Offline"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                    }`}>
                      {kursus.mode}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">
                      {kursus.durasi}
                    </span>
                  </div>
                  
                  {/* Full width button */}
                  <Button className="h-9 w-full bg-[#2d7a3c] text-[11px] font-bold text-white hover:bg-[#235d2e] rounded-lg">
                    {kursus.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AcademyKursusSection;
