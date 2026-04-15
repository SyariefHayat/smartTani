"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ACADEMY_JALUR, 
  ACADEMY_INSTRUKTUR, 
  ACADEMY_TESTIMONI 
} from "@/constants/sitani-academy";
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
    <Compass key="pemula" className="size-5 text-[#2e5e3a]" />,
    <GraduationCap key="menengah" className="size-5 text-[#2e5e3a]" />,
    <Medal key="ahli" className="size-5 text-[#2e5e3a]" />,
  ];

  const jalurBgs = [
    "bg-[#e9f2e9]",
    "bg-[#e5eff8]",
    "bg-[#e9f2e9]",
  ];

  // Get only first testimonial for the grid view
  const testimonial = ACADEMY_TESTIMONI.items[0];

  return (
    <section className="py-12 bg-white">
      <div className="container-smarttani mx-auto px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Jalur Pembelajaran Section */}
          <div className="bg-[#f4f7f4] rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-[#17391f]">
                  {ACADEMY_JALUR.heading}
                </h3>
                <p className="text-xs text-[#5d7a64] mt-1">
                  {ACADEMY_JALUR.subtext}
                </p>
              </div>
              <Link href="/academy/jalur" className="text-[10px] font-bold text-[#2e5e3a] flex items-center gap-1 hover:underline whitespace-nowrap">
                Lihat Semua Jalur <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="flex items-center justify-between gap-2 mt-4">
              {ACADEMY_JALUR.items.map((jalur, index) => (
                <React.Fragment key={jalur.level}>
                  <div className={`${jalurBgs[index]} rounded-xl p-4 flex-1 flex flex-col items-center text-center`}>
                    <div className="mb-3">
                      {jalurIcons[index]}
                    </div>
                    <h4 className="text-sm font-bold text-[#2e5e3a] mb-1">{jalur.level}</h4>
                    <p className="text-[10px] text-[#5d7a64] leading-tight mb-3 line-clamp-2">
                      {jalur.description}
                    </p>
                    <div className="mt-auto pt-2 border-t border-[#17391f]/5 w-full">
                      <span className="text-[10px] font-bold text-[#17391f]">
                        {jalur.jumlahKursus} Kursus - {jalur.jumlahJam} Jam
                      </span>
                    </div>
                  </div>
                  {index < ACADEMY_JALUR.items.length - 1 && (
                    <ArrowRight className="size-4 text-[#17391f]/20 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Instruktur Ahli Section */}
          <div className="bg-[#f4f7f4] rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#17391f]">
                  {ACADEMY_INSTRUKTUR.heading}
                </h3>
                <p className="text-xs text-[#5d7a64] mt-1">
                  {ACADEMY_INSTRUKTUR.subtext}
                </p>
              </div>
              <Link href="/academy/instruktur" className="text-[10px] font-bold text-[#2e5e3a] flex items-center gap-1 hover:underline whitespace-nowrap">
                Lihat Semua <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="space-y-6">
              {ACADEMY_INSTRUKTUR.items.slice(0, 2).map((instruktur) => (
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
                    <h4 className="text-sm font-bold text-[#17391f]">{instruktur.nama}</h4>
                    <p className="text-xs text-[#5d7a64] mb-1">{instruktur.gelar.split(" di ")[0]}</p>
                    <div className="flex items-center gap-1">
                      <Star className="size-3 fill-[#f0a500] text-[#f0a500]" />
                      <span className="text-xs font-bold text-[#17391f]">{instruktur.rating}</span>
                      <span className="text-xs text-[#5d7a64]">({instruktur.jumlahPeserta.toLocaleString()} peserta)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimoni Peserta Section */}
          <div className="bg-[#f4f7f4] rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-[#17391f]">
                Testimoni Peserta
              </h3>
              <Link href="/academy/testimoni" className="text-[10px] font-bold text-[#2e5e3a] flex items-center gap-1 hover:underline whitespace-nowrap">
                Lihat Semua <MoveRight className="size-3" />
              </Link>
            </div>

            <div className="flex flex-col flex-1">
              <Quote className="size-6 text-[#17391f]/10 mb-3" />
              <p className="text-sm italic text-[#5d7a64] leading-relaxed mb-6">
                "{testimonial.quote.length > 120 ? testimonial.quote.substring(0, 120) + "..." : testimonial.quote}"
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
                    <h4 className="text-sm font-bold text-[#17391f]">{testimonial.nama}</h4>
                    <p className="text-[10px] text-[#5d7a64]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3 fill-yellow-400 text-yellow-400" />
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
