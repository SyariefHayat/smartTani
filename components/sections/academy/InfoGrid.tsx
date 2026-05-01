"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ACADEMY_LEARNING_PATHS,
  ACADEMY_INSTRUCTORS,
  ACADEMY_TESTIMONIALS
} from "@/constants/academy";
import {
  ArrowRight,
  Star,
  Quote,
  Compass,
  GraduationCap,
  Medal
} from "lucide-react";

const InfoGrid = () => {
  const jalurIcons = [
    <Compass key="pemula" className="size-5 text-primary" />,
    <GraduationCap key="menengah" className="size-5 text-primary" />,
    <Medal key="ahli" className="size-5 text-primary" />,
  ];

  const jalurBgs = [
    "bg-primary-light",
    "bg-blue-50",
    "bg-primary-light",
  ];

  const testimonial = ACADEMY_TESTIMONIALS.items[0];

  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">

          {/* Jalur Pembelajaran Section */}
          <div className="md:col-span-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#17391f] md:text-3xl lg:text-lg">
                  {ACADEMY_LEARNING_PATHS.heading}
                </h2>
                <p className="text-xs md:text-base lg:text-xs font-medium text-[#5d7a64] mt-0.5">
                  {ACADEMY_LEARNING_PATHS.subtext}
                </p>
              </div>
              <Link
                href="/academy/learning-paths"
                className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="flex flex-col gap-2.5">
              {ACADEMY_LEARNING_PATHS.items.map((jalur, index) => (
                <React.Fragment key={jalur.level}>
                  <div className={`${jalurBgs[index]} rounded-xl p-3.5 flex items-center gap-3 border border-gray-100 shadow-sm transition-all hover:border-gray-300`}>
                    <div className="shrink-0 flex size-10 items-center justify-center rounded-xl bg-white shadow-sm text-primary">
                      {jalurIcons[index]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-[#17391f] leading-tight">{jalur.level}</h4>
                      <p className="text-[11px] font-medium text-[#5d7a64] leading-tight line-clamp-1 mt-0.5">
                        {jalur.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[11px] font-extrabold text-[#17391f] whitespace-nowrap block">
                        {jalur.jumlahKursus} Kursus
                      </span>
                      <p className="text-[10px] font-medium text-[#5d7a64] whitespace-nowrap">{jalur.jumlahJam} Jam</p>
                    </div>
                  </div>
                  {index < ACADEMY_LEARNING_PATHS.items.length - 1 && (
                    <div className="flex justify-center -my-1 py-1">
                      <ArrowRight className="size-4 text-primary/30 rotate-90" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Instruktur Ahli Section */}
          <div className="md:col-span-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#17391f] md:text-3xl lg:text-lg">
                  {ACADEMY_INSTRUCTORS.heading}
                </h2>
                <p className="text-xs md:text-base lg:text-xs font-medium text-[#5d7a64] mt-0.5">
                  {ACADEMY_INSTRUCTORS.subtext}
                </p>
              </div>
              <Link
                href="/academy/instructors"
                className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {ACADEMY_INSTRUCTORS.items.slice(0, 2).map((instruktur) => (
                <div key={instruktur.nama} className="flex items-center gap-4 bg-[#EAF3DE] rounded-2xl p-4 shadow-sm border border-transparent transition-all hover:border-gray-300">
                  <div className="relative size-14 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                    <Image src={instruktur.image} alt={instruktur.nama} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-[#17391f] truncate">{instruktur.nama}</h4>
                    <p className="text-xs font-medium text-[#5d7a64] mb-1.5 truncate">{instruktur.gelar.split(" di ")[0]}</p>
                    <div className="flex items-center gap-1.5">
                      <Star className="size-3.5 fill-accent text-accent" />
                      <span className="text-xs font-bold text-[#17391f]">{instruktur.rating}</span>
                      <span className="text-xs font-medium text-[#5d7a64]">({instruktur.jumlahPeserta.toLocaleString()} peserta)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimoni Peserta Section */}
          <div className="md:col-span-1">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Quote className="size-5 fill-[#3B6D11] text-[#3B6D11] shrink-0" aria-hidden="true" />
                <h2 className="text-lg font-extrabold text-[#17391f] md:text-3xl lg:text-lg">
                  Testimoni Peserta
                </h2>
              </div>
              <Link
                href="/academy/testimonials"
                className="text-xs font-bold text-primary hover:underline whitespace-nowrap"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="flex flex-col rounded-2xl bg-[#EAF3DE] p-6 shadow-sm min-h-[160px]">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative size-12 overflow-hidden rounded-full border border-gray-100 shadow-sm shrink-0">
                    <Image src={testimonial.avatar} alt={testimonial.nama} fill className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-[#17391f] truncate">{testimonial.nama}</h4>
                    <p className="text-[0.65rem] font-medium text-[#5d7a64] md:text-xs truncate">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 shrink-0" aria-label="Rating 5 bintang">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-accent text-accent" aria-hidden="true" />
                  ))}
                </div>
              </div>
              <p className="text-xs leading-relaxed italic text-[#5d7a64] md:text-sm">
                &ldquo;{testimonial.quote.length > 140 ? testimonial.quote.substring(0, 140) + "..." : testimonial.quote}&rdquo;
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InfoGrid;