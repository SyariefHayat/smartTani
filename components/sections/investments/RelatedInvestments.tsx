"use client";

import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Calendar } from "lucide-react";
import { INVESTMENT_PROJECTS } from "@/constants/investments";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function RelatedInvestments() {
  const relatedItems = INVESTMENT_PROJECTS.items.slice(0, 3);

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-bold text-gray-900">Proyek Serupa</h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedItems.map((project) => (
          <Link
            key={project.id}
            href={`/investments/${project.id}`}
            className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {project.badge && (
                <div className="absolute right-4 top-4">
                  <Badge className="bg-[#BA7517]">{project.badge}</Badge>
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="text-xs font-bold text-[#1A6B2F] uppercase">
                {project.kategori}
              </div>
              <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[#1A6B2F]">
                {project.title}
              </h3>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#BA7517]" />
                  <span className="text-xs text-gray-500">{project.imbalHasil}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#BA7517]" />
                  <span className="text-xs text-gray-500">{project.durasi}</span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Terkumpul</span>
                  <span className="font-bold">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>{project.terkumpul}</span>
                  <span>Target Rp 5 Miliar</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

