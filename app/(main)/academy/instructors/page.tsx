import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { ChevronRight, Home, Star, Users, Award, BookOpen } from "lucide-react";
import { ACADEMY_INSTRUCTORS } from "@/constants/academy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Instruktur SiTani Academy",
};

export default function InstrukturPage() {
  const stats = [
    { label: "Instruktur Aktif", value: "125+", icon: Users },
    { label: "Rating Rata-rata", value: "4.9", icon: Star },
    { label: "Alumni", value: "45.680+", icon: Award },
    { label: "Kursus", value: "320+", icon: BookOpen },
  ];

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
            <span className="font-medium text-white">Instruktur</span>
          </nav>
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold md:text-4xl">
              {ACADEMY_INSTRUCTORS.heading}
            </h1>
            <p className="mt-3 text-white/80 text-lg">
              {ACADEMY_INSTRUCTORS.subtext}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3 text-primary">
                  <stat.icon className="size-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACADEMY_INSTRUCTORS.items.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl border border-slate-200 p-8 text-center transition-all hover:shadow-xl hover:border-primary/20 hover:-translate-y-1"
            >
              <div className="relative size-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-500" />
                <div className="relative size-full rounded-full overflow-hidden border-4 border-white shadow-md">
                  <Image
                    src={item.image}
                    alt={item.nama}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1">{item.nama}</h3>
              <p className="text-sm font-medium text-primary mb-4">{item.gelar}</p>
              
              <div className="flex items-center justify-center gap-6 mb-6">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-accent font-bold">
                    <Star className="size-4 fill-accent" />
                    <span>{item.rating}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Rating</span>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="flex flex-col items-center">
                  <div className="text-gray-900 font-bold">
                    {item.jumlahPeserta.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Peserta</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {["Pakar Agronomi", "Konsultan", "Praktisi"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-slate-50 text-slate-600 border-none font-bold text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Button asChild className="w-full bg-primary hover:bg-primary-dark font-bold rounded-xl h-12 !text-white shadow-lg shadow-primary/10">
                <Link href="/academy">Lihat Kursus</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 mt-8">
        <div className="rounded-[2.5rem] bg-white p-8 md:p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Ingin menjadi instruktur di SiTani Academy?
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Bagikan pengetahuan dan pengalaman Anda untuk memajukan pertanian Indonesia. Kami mencari pakar dan praktisi yang bersemangat mengajar.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="h-12 px-8 rounded-xl font-bold border-primary text-primary hover:bg-primary/5">
              <Link href="/contact">
                Daftar sebagai Instruktur
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

