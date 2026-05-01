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

const Features = () => {
  return (
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="rounded-[32px] bg-[#EAF3DE]/40 p-6 md:p-10">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              Keunggulan Belajar di SiTani Academy
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium text-[#5d7a64] md:text-base">
              Kami menyediakan ekosistem pembelajaran yang dirancang khusus untuk
              meningkatkan kompetensi dan hasil panen petani Indonesia.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-5 items-stretch">
            {ACADEMY_KEUNGGULAN.map((feature, index) => {
              const Icon = ACADEMY_FEATURES_ICONS[index] || BookOpen;

              return (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Icon Wrapper */}
                  <div className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm">
                    <Icon className="size-7" />
                  </div>

                  <div className="flex flex-col flex-1 items-center">
                    <h3 className="mb-2 text-lg font-extrabold text-[#17391f]">
                      {feature.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#5d7a64] md:text-sm">
                      {feature.description}
                    </p>
                  </div>

                  <Link
                    href="#"
                    className="mt-6 group flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-primary/80"
                  >
                    Pelajari Selengkapnya
                    <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;



