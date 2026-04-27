"use client";

import Image from "next/image";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AcademyCourse } from "@/constants/types";

interface CourseHeroProps {
  course: AcademyCourse;
}

export default function CourseHero({ course }: CourseHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-20 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge className="bg-primary-medium hover:bg-primary-dark border-none">
              {course.mode}
            </Badge>
            <Badge variant="outline" className="border-white/50 text-white">
              Menengah
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold md:text-display lg:text-6xl leading-tight text-white">
            {course.title}
          </h1>

          <div className="mt-8 flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-primary-medium">
              <Image
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt={course.instruktur.nama}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {course.instruktur.nama}
              </div>
              <div className="text-xs text-white/70">
                {course.instruktur.gelar}
              </div>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Rating", value: `${course.rating} ★`, icon: Star },
              { label: "Peserta", value: `${course.ulasan}+`, icon: Users },
              { label: "Durasi", value: course.durasi, icon: Clock },
              { label: "Modul", value: "12 Materi", icon: BookOpen },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                <stat.icon className="size-5 text-accent mb-2" />
                <div className="text-[11px] uppercase font-semibold text-white/60 leading-tight">{stat.label}</div>
                <div className="text-caption font-extrabold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
