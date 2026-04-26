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
      <h2 className="text-2xl font-bold text-gray-900">Kursus Lainnya</h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedCourses.map((course, i) => (
          <Link
            key={i}
            href={`/academy/${i + 1}`}
            className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl"
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
                  <Badge className="bg-[#1A6B2F]">{course.badge}</Badge>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[#1A6B2F]">
                {course.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                {course.description}
              </p>
              
              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold">{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">{course.durasi}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

