"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, Quote, Star, Award, Users, Smile } from "lucide-react";
import { ACADEMY_TESTIMONIALS, ACADEMY_KURSUS } from "@/constants/academy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TestimoniPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filters = ["Semua", "Petani", "Peternak", "Pengusaha Agri"];

  const stats = [
    { label: "Alumni Terdaftar", value: "45.680+", icon: Users },
    { label: "Tingkat Kepuasan", value: "98,6%", icon: Smile },
    { label: "Rating Alumni", value: "4.8/5", icon: Star },
  ];

  const filteredTestimoni = useMemo(() => {
    if (activeFilter === "Semua") return ACADEMY_TESTIMONIALS.items;
    return ACADEMY_TESTIMONIALS.items.filter((item) =>
      item.role.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [activeFilter]);

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-primary py-12 text-white">
        <div className="container mx-auto px-4">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/80">
            <Link href="/" className="flex items-center gap-1 hover:text-white">
              <Home className="size-3" />
              Beranda
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/academy" className="hover:text-white">
              SiTani Academy
            </Link>
            <ChevronRight className="size-3" />
            <span className="font-medium text-white">Testimoni</span>
          </nav>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold md:text-4xl">
              {ACADEMY_TESTIMONIALS.heading}
            </h1>
            <p className="mt-3 text-white/80 text-lg">
              {ACADEMY_TESTIMONIALS.subtext}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-5 justify-center md:justify-start px-4">
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                  <stat.icon className="size-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all ${
                activeFilter === f
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "bg-white text-gray-600 border border-slate-200 hover:border-primary/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Testimoni Grid */}
      <section className="container mx-auto px-4 pb-12">
        {filteredTestimoni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimoni.map((item, idx) => {
              // Mock associated course
              const mockCourse = ACADEMY_KURSUS.items[idx % ACADEMY_KURSUS.items.length];
              
              return (
                <div
                  key={idx}
                  className="group bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <Quote className="size-12 text-primary/10 mb-6 group-hover:text-primary/20 transition-colors" />
                  
                  <p className="text-gray-700 italic leading-relaxed mb-8 line-clamp-4 min-h-[6rem]">
                    &quot;{item.quote}&quot;
                  </p>

                  <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                    <div className="relative size-14 shrink-0 rounded-2xl overflow-hidden shadow-sm">
                      <Image
                        src={item.avatar}
                        alt={item.nama}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.nama}</h4>
                      <p className="text-xs text-muted-foreground truncate">{item.role}</p>
                      <div className="flex gap-0.5 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`size-3 ${i < item.rating ? 'fill-accent text-accent' : 'text-slate-200'}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-2">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-none font-bold text-[10px] py-1 px-3 rounded-full flex items-center gap-1.5">
                      <Award className="size-3" />
                      Lulusan: {mockCourse.title}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
            <p className="text-gray-500 font-medium">
              Belum ada testimoni untuk kategori &quot;{activeFilter}&quot;.
            </p>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 mt-16">
        <div className="rounded-[2.5rem] bg-white p-8 md:p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Bergabunglah dan rasakan manfaatnya
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Mulai perjalanan sukses Anda di dunia pertanian sekarang juga. Bergabunglah dengan ribuan alumni yang telah bertransformasi.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild className="bg-primary hover:bg-primary-dark h-12 px-10 rounded-xl font-bold !text-white shadow-lg shadow-primary/20 transition-all active:scale-95">
              <Link href="/signup">
                Daftar Gratis Sekarang
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

