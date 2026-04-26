"use client";

import React from "react";
import Link from "next/link";
import { ACADEMY_KEUNGGULAN } from "@/constants/academy";
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
  "bg-primary-light",
  "bg-amber-50",
  "bg-blue-50",
  "bg-purple-50",
  "bg-slate-100",
];

const AcademyFiturSection = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">

        {/* Header */}
        <div className="mb-10 md:mb-12 flex flex-col items-center text-center">
          <h2 className="text-heading-2 font-bold text-foreground">
            Keunggulan Belajar di SiTani Academy
          </h2>
          <div className="mt-3 h-1 w-16 rounded-full bg-primary" />
          <p className="mt-4 max-w-2xl text-body-sm text-muted-foreground">
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
                className={`flex flex-col h-full p-5 md:p-6 items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-2xl ${bgColor}`}
              >
                {/* Icon Wrapper */}
                <div className="mb-4 flex size-14 items-center justify-center rounded-xl bg-white shadow-sm">
                  <Icon className="size-7 text-primary" strokeWidth={1.5} />
                </div>

                <div className="flex flex-col flex-1 items-center">
                  <h3 className="mb-2 text-body font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-caption text-muted-foreground">
                    {feature.description}
                  </p>
                </div>

                <Link
                  href="#"
                  className="mt-6 group flex items-center gap-1.5 text-caption font-bold text-primary transition-colors hover:text-primary/80 uppercase tracking-wider"
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

