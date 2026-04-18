"use client";

import { MapPin, Calendar, TrendingUp, Wallet, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface InvestasiDetailHeroProps {
  project: any;
}

export default function InvestasiDetailHero({ project }: InvestasiDetailHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gray-900 py-20 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-3xl">
          <Badge className="bg-[#BA7517] hover:bg-[#a06514] mb-4">
            {project.kategori}
          </Badge>
          <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
            {project.title}
          </h1>
          <div className="mt-4 flex items-center gap-2 text-gray-300">
            <MapPin className="h-5 w-5 text-[#BA7517]" />
            <span className="text-lg">Lokasi: Seluruh Indonesia</span>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Imbal Hasil", value: project.imbalHasil, icon: TrendingUp },
              { label: "Durasi", value: project.durasi, icon: Calendar },
              { label: "Terkumpul", value: project.terkumpul, icon: CheckCircle2 },
              { label: "Min. Investasi", value: project.minimalInvestasi, icon: Wallet },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl bg-white/10 p-4 backdrop-blur-sm border border-white/10">
                <stat.icon className="h-5 w-5 text-[#BA7517] mb-2" />
                <div className="text-xs text-gray-400">{stat.label}</div>
                <div className="text-sm font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Dana Terkumpul</span>
              <span className="font-bold text-white">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2 bg-white/20" />
            <p className="text-xs text-gray-400">
              {project.terkumpul} terkumpul dari target pendanaan
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
