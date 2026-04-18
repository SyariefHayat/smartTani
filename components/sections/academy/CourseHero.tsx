"use client";

import Image from "next/image";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseHeroProps {
  course: any;
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
            <Badge className="bg-[#1A6B2F] hover:bg-[#145224]">
              {course.mode}
            </Badge>
            <Badge variant="outline" className="border-white text-white">
              Menengah
            </Badge>
          </div>

          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl leading-tight">
            {course.title}
          </h1>

          <div className="mt-8 flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#1A6B2F]">
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
              <div className="text-xs text-gray-400">
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
                <stat.icon className="h-5 w-5 text-[#BA7517] mb-2" />
                <div className="text-xs text-gray-400">{stat.label}</div>
                <div className="text-sm font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
