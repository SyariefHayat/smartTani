"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ACADEMY_KURSUS } from "@/constants/academy";
import { Star, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AcademyCoursesSection = () => {
  return (
    <section className="bg-white">
      <div className="container-smarttani">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {ACADEMY_KURSUS.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
              {ACADEMY_KURSUS.subtext}
            </p>
          </div>
          <Link
            href="/academy"
            className="group flex items-center gap-2 text-sm font-bold text-primary transition-all hover:text-primary/80"
          >
            Lihat Semua Kursus
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Kursus Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {ACADEMY_KURSUS.items.map((kursus) => {
            const isOrangeBadge =
              kursus.badge === "BEST SELLER" ||
              kursus.badge === "BARU" ||
              kursus.badge === "HOT";

            return (
              <Link
                key={kursus.title}
                href={`/academy/${kursus.id}`}
                className="group flex flex-col rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
              >
                {/* Image & Badge Wrapper */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={kursus.image}
                    alt={kursus.title}
                    fill
                    className="object-cover"
                  />

                  {kursus.badge && (
                    <Badge className={`absolute left-3 top-3 px-2 py-0.5 text-[10px] font-bold border-none shadow-sm rounded !text-white ${isOrangeBadge ? "bg-accent" : "bg-primary"
                      }`}>
                      {kursus.badge}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="mb-2 text-base font-extrabold text-[#17391f] line-clamp-2 min-h-[3rem]">
                    {kursus.title}
                  </h3>

                  <p className="mb-5 text-xs font-medium text-[#5d7a64] line-clamp-2">
                    {kursus.description}
                  </p>

                  {/* Instructor */}
                  <div className="mb-5 flex items-center gap-3">
                    <div className="relative size-10 overflow-hidden rounded-full bg-slate-100 ring-2 ring-slate-50">
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-caption font-bold text-muted-foreground">
                        {kursus.instruktur.nama.charAt(0)}
                      </div>
                      <Image
                        src={`/images/about/director-${kursus.instruktur.nama.toLowerCase().split(' ').pop()}.jpeg`}
                        alt={kursus.instruktur.nama}
                        fill
                        className="object-cover"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[#17391f]">
                        {kursus.instruktur.nama}
                      </p>
                      <p className="truncate text-[10px] font-medium text-[#5d7a64]">
                        {kursus.instruktur.gelar}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-5 flex items-center gap-2 text-xs font-bold">
                    <Star className="size-4 fill-accent text-accent" />
                    <span className="text-accent-dark">{kursus.rating}</span>
                    <span className="text-[#5d7a64] font-medium">({kursus.ulasan.toLocaleString('id-ID')})</span>
                  </div>

                  {/* Mode & Duration */}
                  <div className="mt-auto mb-5 flex items-center justify-between gap-2">
                    <div className={`px-3 py-1 text-[10px] font-bold rounded border ${kursus.mode === "Online"
                      ? "bg-primary-light text-primary border-primary/20"
                      : kursus.mode === "Offline"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                      {kursus.mode}
                    </div>
                    <span className="text-caption font-bold text-[#5d7a64]">
                      {kursus.durasi}
                    </span>
                  </div>

                  {/* Button */}
                  <Button asChild className="h-10 w-full bg-primary text-sm font-bold !text-white hover:bg-primary-dark rounded-xl transition-all shadow-sm cursor-pointer">
                    <span>{kursus.cta}</span>
                  </Button>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AcademyCoursesSection;

