"use client";

import Image from "next/image";
import { Star, Users, Award } from "lucide-react";

interface CourseInstructorProps {
  instructor: any;
}

export default function CourseInstructor({ instructor }: CourseInstructorProps) {
  return (
    <div className="mt-16 rounded-2xl border border-gray-100 bg-gray-50 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Instruktur Kursus</h2>
      <div className="flex flex-col gap-8 md:flex-row items-start">
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-2xl">
          <Image
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt={instructor.nama}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">{instructor.nama}</h3>
          <p className="text-[#1A6B2F] font-medium">{instructor.gelar}</p>
          
          <div className="mt-4 flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-bold">4.9 Rating Instruktur</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[#BA7517]" />
              <span className="text-sm font-bold">2.500+ Peserta</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#BA7517]" />
              <span className="text-sm font-bold">15+ Kursus</span>
            </div>
          </div>

          <div className="mt-6 text-gray-600 leading-relaxed">
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
