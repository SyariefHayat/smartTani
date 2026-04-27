"use client";

import Image from "next/image";
import { Star, Users, Award } from "lucide-react";
import { AcademyInstructor } from "@/constants/types";

interface CourseInstructorProps {
  instructor: AcademyInstructor;
}

export default function CourseInstructor({ instructor }: CourseInstructorProps) {
  return (
    <div className="mt-16 rounded-2xl border border-slate-100 bg-slate-50 p-8 shadow-sm">
      <h2 className="text-2xl font-extrabold text-[#17391f] mb-8">Instruktur Kursus</h2>
      <div className="flex flex-col gap-8 md:flex-row items-start">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl shadow-md border-4 border-white">
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt={instructor.nama}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-extrabold text-[#17391f]">{instructor.nama}</h3>
          <p className="text-primary font-bold text-sm uppercase tracking-wider mt-1">{instructor.gelar}</p>
          
          <div className="mt-6 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Star className="size-4 text-accent fill-accent" />
              <span className="text-sm font-bold text-[#17391f]">4.9 Rating Instruktur</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-primary" />
              <span className="text-sm font-bold text-[#17391f]">2.500+ Peserta</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="size-4 text-primary" />
              <span className="text-sm font-bold text-[#17391f]">15+ Kursus</span>
            </div>
          </div>

          <div className="mt-6 text-[#5d7a64] leading-relaxed font-medium">
            <p>
              {instructor.nama} adalah seorang praktisi dan akademisi berpengalaman di bidang 
              pertanian modern dengan spesialisasi pada optimasi hasil panen dan manajemen 
              sumber daya. Telah membimbing ribuan petani di seluruh Indonesia untuk 
              menerapkan teknik bertani yang lebih efektif dan berkelanjutan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
