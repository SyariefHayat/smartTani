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
  MoveRight,
  Star,
  Quote,
  Compass,
  GraduationCap,
  Medal
} from "lucide-react";

const AcademyInfoGridSection = () => {
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
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Jalur Pembelajaran Section */}
          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-body font-bold text-foreground">
                  {ACADEMY_LEARNING_PATHS.heading}
                </h3>
                <p className="text-caption text-muted-foreground mt-1">
                  {ACADEMY_LEARNING_PATHS.subtext}
                </p>
              </div>
              <Link href="/academy/learning-paths" className="text-caption font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap">
                Lihat Semua Jalur <MoveRight className="size-3" />
              </Link>
            </div>

            {/* Selalu vertikal — cukup untuk kolom 1/3 di desktop */}
            <div className="flex flex-col gap-2 mt-4">
              {ACADEMY_LEARNING_PATHS.items.map((jalur, index) => (
                <React.Fragment key={jalur.level}>
                  <div className={`${jalurBgs[index]} rounded-xl p-3 flex items-center gap-3`}>
                    <div className="shrink-0 flex size-8 items-center justify-center rounded-lg bg-white/60">
                      {jalurIcons[index]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-body-sm font-bold text-primary leading-tight">{jalur.level}</h4>
                      <p className="text-[11px] text-muted-foreground leading-tight line-clamp-1">
                        {jalur.description}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-[11px] font-bold text-foreground whitespace-nowrap">
                        {jalur.jumlahKursus} Kursus
                      </span>
                      <p className="text-[10px] text-muted-foreground whitespace-nowrap">{jalur.jumlahJam} Jam</p>
                    </div>
                  </div>
                  {index < ACADEMY_LEARNING_PATHS.items.length - 1 && (
                    <div className="flex justify-center">
                      <ArrowRight className="size-3.5 text-foreground/20 rotate-90" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Instruktur Ahli Section */}
          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-body font-bold text-foreground">
                  {ACADEMY_INSTRUCTORS.heading}
                </h3>
                <p className="text-caption text-muted-foreground mt-1">
                  {ACADEMY_INSTRUCTORS.subtext}
                </p>
              </div>
              <Link href="/academy/instructors" className="text-caption font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap">
                Lihat Semua <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-6">
              {ACADEMY_INSTRUCTORS.items.slice(0, 2).map((instruktur) => (
                <div key={instruktur.nama} className="flex items-center gap-4">
                  <div className="relative size-14 rounded-full overflow-hidden border border-slate-200">
                    <Image
                      src={instruktur.image}
                      alt={instruktur.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-body-sm font-bold text-foreground">{instruktur.nama}</h4>
                    <p className="text-caption text-muted-foreground mb-1">{instruktur.gelar.split(" di ")[0]}</p>
                    <div className="flex items-center gap-1">
                      <Star className="size-3 fill-accent text-accent" />
                      <span className="text-caption font-bold text-foreground">{instruktur.rating}</span>
                      <span className="text-caption text-muted-foreground">({instruktur.jumlahPeserta.toLocaleString()} peserta)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimoni Peserta Section */}
          <div className="bg-slate-50 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-body font-bold text-foreground">
                Testimoni Peserta
              </h3>
              <Link href="/academy/testimonials" className="text-caption font-bold text-primary flex items-center gap-1 hover:underline whitespace-nowrap">
                Lihat Semua <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="flex flex-col flex-1">
              <Quote className="size-6 text-foreground/10 mb-3" />
              <p className="text-body-sm italic text-muted-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.quote.length > 120 ? testimonial.quote.substring(0, 120) + "..." : testimonial.quote}&rdquo;
              </p>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.nama}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-body-sm font-bold text-foreground">{testimonial.nama}</h4>
                    <p className="text-caption text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-accent text-accent" />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AcademyInfoGridSection;
