"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ARTICLE_DUMMY, 
  ARTIKEL_KATEGORI_POPULER, 
  ARTIKEL_TERPOPULER 
} from "@/constants/article";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";

const ArtikelLayoutSection = () => {
  return (
    <section className="bg-white py-12">
      <div className="container-smarttani px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          
          {/* Main Content: Article Grid */}
          <div className="flex-1 lg:max-w-[75%]">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-[#1e3a1f]">
                Artikel Terbaru
              </h2>
              <Link href="#" className="flex items-center gap-1 text-sm font-bold text-[#2d7a3a] hover:underline">
                Lihat Semua Artikel
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {ARTICLE_DUMMY.map((artikel, index) => (
                <article 
                  key={index}
                  className="group flex flex-col overflow-hidden rounded-xl border border-[#f1f5f9] bg-white transition-all hover:shadow-lg"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={artikel.image}
                      alt={artikel.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge className="bg-[#1d4ed8] text-white text-[10px] font-bold px-2 py-0.5">
                        {artikel.kategori}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold text-[#64748b]">
                      <span>{artikel.tanggal}</span>
                      <span className="text-[#cbd5e1]">•</span>
                      <span>{artikel.waktuBaca}</span>
                    </div>

                    <h3 className="mb-3 text-sm font-black leading-snug text-[#1e3a1f] line-clamp-2 transition-colors group-hover:text-[#2d7a3a]">
                      <Link href="#">{artikel.title}</Link>
                    </h3>

                    <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#64748b]">
                      {artikel.description}
                    </p>

                    {/* Author */}
                    <div className="mt-auto flex items-center gap-2 border-t border-[#f1f5f9] pt-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={artikel.penulis.avatar} alt={artikel.penulis.nama} />
                        <AvatarFallback className="bg-[#2d7a3a]/10 text-[8px] font-black text-[#2d7a3a]">
                          {artikel.penulis.nama.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="truncate text-[10px] font-black text-[#1e3a1f]">
                          {artikel.penulis.nama}
                        </p>
                        <p className="truncate text-[8px] font-bold text-[#94a3b8]">
                          {artikel.penulis.gelar}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-[25%] lg:shrink-0">
            <div className="flex flex-col gap-10">
              
              {/* Popular Categories */}
              <div className="rounded-xl bg-[#f8fafc] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-base font-black text-[#1e3a1f]">
                    Kategori Populer
                  </h3>
                </div>
                <div className="flex flex-col gap-2">
                  {ARTIKEL_KATEGORI_POPULER.map((cat, idx) => (
                    <Link 
                      key={idx}
                      href="#"
                      className="group flex items-center justify-between py-1 transition-all"
                    >
                      <span className="text-xs font-bold text-[#475569] transition-colors group-hover:text-[#2d7a3a]">
                        {cat.label}
                      </span>
                      <span className="text-xs font-bold text-[#94a3b8]">
                        {cat.jumlahArtikel}
                      </span>
                    </Link>
                  ))}
                  <Link href="#" className="mt-4 flex items-center gap-1 text-[11px] font-black text-[#2d7a3a] hover:underline">
                    Lihat Semua Kategori
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Trending Articles */}
              <div className="">
                <h3 className="mb-6 text-base font-black text-[#1e3a1f]">
                  Artikel Terpopuler
                </h3>
                <div className="flex flex-col gap-5">
                  {ARTIKEL_TERPOPULER.map((trending, idx) => (
                    <Link 
                      key={idx}
                      href="#"
                      className="group flex items-start gap-4"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-sm font-black text-[#1e3a1f]">
                        {trending.rank}
                      </span>
                      <div className="flex gap-3">
                        {/* Thumbnail placeholder if needed, but the image shows just text for trending? */}
                        {/* Actually, looking at the image, trending items HAVE thumbnails too! */}
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-[#f1f5f9]">
                          <Image
                            src={`/images/article/hero-bg.webp`} // Placeholder or dynamic if available
                            alt={trending.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="mb-1 text-[11px] font-black leading-snug text-[#1e3a1f] transition-colors group-hover:text-[#2d7a3a] line-clamp-2">
                            {trending.title}
                          </h4>
                          <p className="text-[10px] font-bold text-[#94a3b8]">
                            {trending.tanggal}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
};

export default ArtikelLayoutSection;
