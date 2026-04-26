"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, User, Calendar, Clock, Loader2, MessageCircle, X } from "lucide-react";
import { ACADEMY_WEBINARS } from "@/constants/academy";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { showToast } from "@/lib/toast";

export default function WebinarPage() {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const filters = ["Semua", "Webinar", "Workshop", "Seminar"];

  const filteredEvents = useMemo(() => {
    if (activeFilter === "Semua") return ACADEMY_WEBINARS.items;
    return ACADEMY_WEBINARS.items.filter(
      (item) => item.kategori.toLowerCase() === activeFilter.toLowerCase()
    );
  }, [activeFilter]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    showToast(`Berhasil! Anda terdaftar untuk ${selectedEvent.title}`, "success");
    setSelectedEvent(null);
  };

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
            <span className="font-medium text-white">Webinar & Event</span>
          </nav>
          <div className="max-w-2xl">
            <Badge className="bg-white/20 text-white border-none mb-4">
              SiTani Academy
            </Badge>
            <h1 className="text-3xl font-bold md:text-4xl">
              {ACADEMY_WEBINARS.heading}
            </h1>
            <p className="mt-3 text-white/80 text-lg">
              {ACADEMY_WEBINARS.subtext}
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeFilter === f
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-white text-gray-600 border border-slate-200 hover:border-primary/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Events Grid */}
      <section className="container mx-auto px-4 py-4">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {filteredEvents.map((item, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-primary/20"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="relative w-full sm:w-48 lg:w-56 aspect-video sm:aspect-auto overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`border-none font-bold ${
                        item.kategori === 'WEBINAR' ? 'bg-blue-600' : 'bg-orange-600'
                      }`}>
                        {item.kategori}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight mb-4">
                      {item.title}
                    </h3>
                    
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="size-4 text-primary" />
                        <span className="font-medium">{item.narasumber}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="size-4 text-primary" />
                          <span>{item.tanggal}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="size-4 text-primary" />
                          <span>{item.waktu.split(' - ')[0]}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="mt-auto w-full bg-primary hover:bg-primary-dark font-bold rounded-xl h-11 !text-white"
                      onClick={() => setSelectedEvent(item)}
                    >
                      Daftar Sekarang
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-gray-500 font-medium">
              Tidak ada event ditemukan untuk kategori &quot;{activeFilter}&quot;.
            </p>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="container mx-auto px-4 mt-16">
        <div className="rounded-[2.5rem] bg-white p-8 md:p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Ingin mengadakan webinar bersama Smarttani?
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Kami terbuka untuk kolaborasi dengan pakar, institusi, maupun perusahaan untuk berbagi ilmu di ekosistem Smarttani.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="outline" className="h-12 px-8 rounded-xl font-bold border-primary text-primary hover:bg-primary/5">
              <Link href="/contact">
                <MessageCircle className="mr-2 size-4" />
                Hubungi Kami
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Registration Modal using Sheet */}
      <Sheet open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <SheetContent className="w-full sm:max-w-md p-0 overflow-hidden border-none rounded-l-[2rem]">
          <div className="h-full flex flex-col bg-white">
            <SheetHeader className="p-8 pb-4">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-2xl font-bold text-gray-900">Pendaftaran Event</SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="size-5" />
                  </Button>
                </SheetClose>
              </div>
              <SheetDescription className="text-base mt-2">
                Silakan isi data diri Anda untuk mengikuti event &quot;{selectedEvent?.title}&quot;
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleRegister} className="flex-1 flex flex-col p-8 pt-4">
              <div className="space-y-6 flex-1">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-bold text-gray-700">Nama Lengkap</Label>
                  <Input id="name" placeholder="Contoh: Ahmad Budi" required className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-bold text-gray-700">Alamat Email</Label>
                  <Input id="email" type="email" placeholder="nama@email.com" required className="h-12 rounded-xl" />
                </div>
                
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Dengan mendaftar, Anda setuju untuk menerima informasi terkait event ini dan materi pembelajaran dari SiTani Academy melalui email.
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-dark font-bold rounded-2xl h-14 text-lg !text-white shadow-lg shadow-primary/20"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : null}
                  {loading ? "Mendaftarkan..." : "Konfirmasi Pendaftaran"}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}

