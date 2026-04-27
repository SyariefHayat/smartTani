"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock } from "lucide-react";
import { ACADEMY_KURSUS } from "@/constants/academy";
import { Badge } from "@/components/ui/badge";

export default function RelatedCourses() {
  const relatedCourses = ACADEMY_KURSUS.items.slice(0, 3);

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-extrabold text-[#17391f]">Kursus Lainnya</h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedCourses.map((course, i) => (
          <Link
            key={i}
            href={`/academy/${course.id}`}
            className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {course.badge && (
                <div className="absolute left-4 top-4">
                  <Badge className="bg-primary border-none text-white text-[10px] font-bold px-2 py-0.5">{course.badge}</Badge>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="line-clamp-2 text-base font-extrabold text-[#17391f] group-hover:text-primary transition-colors min-h-[3rem]">
                {course.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs font-medium text-[#5d7a64]">
                {course.description}
              </p>
              
              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div className="flex items-center gap-1.5">
                  <Star className="size-4 fill-accent text-accent" />
                  <span className="text-sm font-bold text-[#17391f]">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#5d7a64]">
                  <Clock className="size-4" />
                  <span className="text-xs font-bold">{course.durasi}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

