"use client";

import React from "react";
import Link from "next/link";
import { ACADEMY_KEUNGGULAN } from "@/constants/sitani-academy";
import { 
  BookOpen, 
  Clock, 
  Award, 
  Users, 
  LifeBuoy,
  ChevronRight 
} from "lucide-react";

const ACADEMY_FEATURES_ICONS = [BookOpen, Clock, Award, Users, LifeBuoy];
const ACADEMY_FEATURES_BG_COLORS = [
  "bg-[#EAF3DE]", // Hijau Muda
  "bg-[#FAEEDA]", // Jingga Muda
  "bg-[#E6F1FB]", // Biru Muda
  "bg-[#F3E8FB]", // Ungu Muda
  "bg-[#F1EFE8]", // Abu-abu Muda
];

const AcademyFiturSection = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container-smarttani mx-auto px-5 sm:px-8 md:px-10 lg:px-12">
        
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-[#17391f] md:text-4xl">
            Keunggulan Belajar di SiTani Academy
          </h2>
          <div className="mt-4 h-1.5 w-20 rounded-full bg-primary" />
          <p className="mt-6 max-w-2xl text-base font-medium text-[#5d7a64] md:text-lg">
            Kami menyediakan ekosistem pembelajaran yang dirancang khusus untuk 
            meningkatkan kompetensi dan hasil panen petani Indonesia.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 items-stretch">
          {ACADEMY_KEUNGGULAN.map((feature, index) => {
            const Icon = ACADEMY_FEATURES_ICONS[index] || BookOpen;
            const bgColor = ACADEMY_FEATURES_BG_COLORS[index] || "bg-slate-50";

            return (
              <div
                key={feature.title}
                className={`flex flex-col h-full p-8 items-center text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl rounded-2xl ${bgColor}`}
              >
                {/* Icon Wrapper */}
                <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Icon className="size-10 text-primary" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col flex-1 items-center">
                  <h3 className="mb-4 text-xl font-bold text-[#17391f]">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5d7a64]">
                    {feature.description}
                  </p>
                </div>

                <Link
                  href="#"
                  className="mt-6 group flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-primary/80 uppercase tracking-wider"
                >
                  Pelajari Selengkapnya
                  <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AcademyFiturSection;
