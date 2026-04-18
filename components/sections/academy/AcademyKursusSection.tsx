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
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-heading-2 font-bold text-foreground">
              {ACADEMY_KURSUS.heading}
            </h2>
            <p className="mt-2 text-body-sm text-muted-foreground">
              {ACADEMY_KURSUS.subtext}
            </p>
          </div>
          <Link
            href="/sitani-academy"
            className="group flex items-center gap-2 text-body-sm font-bold text-primary transition-all hover:text-primary/80"
          >
            Lihat Semua Kursus
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Kursus Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {ACADEMY_KURSUS.items.map((kursus, index) => {
            const isOrangeBadge =
              kursus.badge === "BEST SELLER" ||
              kursus.badge === "BARU" ||
              kursus.badge === "HOT";
            
            return (
              <Link
                key={kursus.title}
                href={`/sitani-academy/${kursus.id}`}
                className="group flex flex-col rounded-2xl bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden"
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
                    <Badge className={`absolute left-2 top-2 px-2 py-0.5 text-caption font-bold border-none shadow-sm rounded !text-white ${isOrangeBadge ? "bg-accent" : "bg-primary"
                      }`}>
                      {kursus.badge}
                    </Badge>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-4">
                  <h3 className="mb-2 text-body-sm font-bold text-foreground line-clamp-2 min-h-[2.5rem]">
                    {kursus.title}
                  </h3>

                  <p className="mb-4 text-caption text-muted-foreground line-clamp-2">
                    {kursus.description}
                  </p>

                  {/* Instructor */}
                  <div className="mb-4 flex items-center gap-2">
                    <div className="relative size-8 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-100">
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-caption font-bold text-muted-foreground">
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
                      <p className="truncate text-caption font-bold text-foreground">
                        {kursus.instruktur.nama}
                      </p>
                      <p className="truncate text-[9px] font-medium text-muted-foreground">
                        {kursus.instruktur.gelar}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-4 flex items-center gap-1.5 text-caption font-bold">
                    <Star className="size-3.5 fill-accent text-accent" />
                    <span className="text-accent-dark">{kursus.rating}</span>
                    <span className="text-muted-foreground font-medium">({kursus.ulasan.toLocaleString('id-ID')})</span>
                  </div>

                  {/* Mode & Duration */}
                  <div className="mt-auto mb-4 flex items-center justify-between gap-2">
                    <div className={`px-3 py-1 text-caption font-bold rounded border ${kursus.mode === "Online"
                      ? "bg-primary-light text-primary border-primary/20"
                      : kursus.mode === "Offline"
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                      {kursus.mode}
                    </div>
                    <span className="text-caption font-bold text-muted-foreground">
                      {kursus.durasi}
                    </span>
                  </div>

                  {/* Button */}
                  <Button asChild className="h-9 w-full bg-primary text-caption font-bold !text-white hover:bg-primary-dark rounded-lg cursor-pointer">
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

export default AcademyKursusSection;
