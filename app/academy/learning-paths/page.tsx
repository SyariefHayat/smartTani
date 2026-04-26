import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ChevronRight, Home, ArrowDown, BookOpen, Clock, PlayCircle } from "lucide-react";
import { ACADEMY_LEARNING_PATHS, ACADEMY_KURSUS } from "@/constants/academy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Jalur Pembelajaran",
};

const levelStyles: Record<string, string> = {
  Pemula: "bg-green-100 text-green-700 border-green-200",
  Menengah: "bg-blue-100 text-blue-700 border-blue-200",
  Ahli: "bg-purple-100 text-purple-700 border-purple-200",
};

export default function JalurPage() {
  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <nav className="mb-8 flex items-center justify-center gap-2 text-sm text-white/80">
            <Link href="/" className="flex items-center gap-1 hover:text-white">
              <Home className="size-3" />
              Beranda
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/academy" className="hover:text-white">
              SiTani Academy
            </Link>
            <ChevronRight className="size-3" />
            <span className="font-medium text-white">Jalur Pembelajaran</span>
          </nav>
          <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl mb-4">
            {ACADEMY_LEARNING_PATHS.heading}
          </h1>
          <p className="mt-4 text-white/80 text-lg max-w-2xl mx-auto">
            {ACADEMY_LEARNING_PATHS.subtext}
          </p>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto space-y-24">
          {ACADEMY_LEARNING_PATHS.items.map((jalur, idx) => {
            // Get relevant courses for this level (mock filter)
            const levelCourses = ACADEMY_KURSUS.items.slice(idx * 2, (idx * 2) + 2);

            return (
              <div key={jalur.level} className="relative">
                {/* Header Jalur */}
                <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
                  <div className="flex-1">
                    <Badge className={`mb-4 px-4 py-1 rounded-full font-bold border ${levelStyles[jalur.level]}`}>
                      Jalur {jalur.level}
                    </Badge>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      Kurikulum {jalur.level}
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {jalur.description}
                    </p>
                    <div className="mt-6 flex items-center gap-6 text-sm font-bold text-gray-400">
                      <div className="flex items-center gap-2">
                        <BookOpen className="size-4 text-primary" />
                        <span>{jalur.jumlahKursus} Kursus</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-primary" />
                        <span>{jalur.jumlahJam} Jam Total</span>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block shrink-0">
                    <div className="size-32 rounded-[2.5rem] bg-slate-50 flex items-center justify-center border-4 border-white shadow-xl rotate-3">
                      <span className="text-5xl font-black text-primary/20">0{idx + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Kursus dalam Jalur */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {levelCourses.map((kursus) => (
                    <Link
                      key={kursus.id}
                      href={`/academy/${kursus.id}`}
                      className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-4 transition-all hover:shadow-md hover:border-primary/20"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                        <Image src={kursus.image} alt={kursus.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        <PlayCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="font-bold text-gray-900 line-clamp-1 mb-2 group-hover:text-primary transition-colors">
                        {kursus.title}
                      </h4>
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        <span>{kursus.durasi}</span>
                        <span className="text-primary">{kursus.mode}</span>
                      </div>
                    </Link>
                  ))}
                  {/* Mock card for remaining courses */}
                  <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-4 flex flex-col items-center justify-center text-center opacity-60">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center mb-3">
                      <BookOpen className="size-5 text-slate-300" />
                    </div>
                    <p className="text-xs font-bold text-slate-400">+{jalur.jumlahKursus - 2} Kursus Lainnya</p>
                  </div>
                </div>

                {/* Connector */}
                {idx < ACADEMY_LEARNING_PATHS.items.length - 1 && (
                  <div className="flex flex-col items-center mt-24">
                    <div className="w-px h-16 bg-gradient-to-b from-primary/20 to-transparent" />
                    <div className="bg-slate-50 px-6 py-2 rounded-full border border-slate-100 text-xs font-bold text-slate-400 flex items-center gap-3">
                      <span>Selesaikan Jalur {jalur.level} untuk membuka Jalur {ACADEMY_LEARNING_PATHS.items[idx+1].level}</span>
                      <ArrowDown className="size-4 animate-bounce" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 mt-20">
        <div className="rounded-[3rem] bg-primary-dark p-8 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <Image src="/images/academy/hero-bg.webp" alt="" fill className="object-cover" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold md:text-5xl">
              Mulai dari mana saja sesuai kemampuan Anda
            </h2>
            <p className="mt-6 text-white/70 text-lg max-w-2xl mx-auto">
              Tingkatkan pengetahuan Anda langkah demi langkah. Bergabunglah sekarang dan jadilah bagian dari revolusi pertanian digital.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className="bg-accent hover:bg-accent/90 h-14 px-10 rounded-2xl font-bold !text-white text-lg shadow-xl shadow-black/20 transition-all active:scale-95">
                <Link href="/register">Mulai Belajar Gratis</Link>
              </Button>
              <Button asChild variant="outline" className="h-14 px-10 rounded-2xl font-bold border-white/20 bg-white/10 text-white hover:bg-white/20 text-lg transition-all active:scale-95">
                <Link href="/academy">Lihat Semua Kursus</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

