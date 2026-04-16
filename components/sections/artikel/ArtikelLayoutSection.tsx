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
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* Main Content: Article Grid */}
          <div className="flex-1 lg:max-w-[75%]">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-heading-2 font-bold text-foreground">
                Artikel Terbaru
              </h2>
              <Link href="#" className="flex items-center gap-1 text-body-sm font-bold text-primary hover:underline">
                Lihat Semua Artikel
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {ARTICLE_DUMMY.map((artikel, index) => (
                <article
                  key={index}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-lg"
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
                      <Badge className="bg-primary !text-white text-caption font-bold px-2.5 py-0.5">
                        {artikel.kategori}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Container */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="mb-2 flex items-center gap-2 text-caption font-semibold text-muted-foreground">
                      <span>{artikel.tanggal}</span>
                      <span className="text-slate-300">•</span>
                      <span>{artikel.waktuBaca}</span>
                    </div>

                    <h3 className="mb-3 text-body-sm font-bold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                      <Link href="#">{artikel.title}</Link>
                    </h3>

                    <p className="mb-4 line-clamp-2 text-caption text-muted-foreground">
                      {artikel.description}
                    </p>

                    {/* Author */}
                    <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={artikel.penulis.avatar} alt={artikel.penulis.nama} />
                        <AvatarFallback className="bg-primary/10 text-[8px] font-bold text-primary">
                          {artikel.penulis.nama.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden">
                        <p className="truncate text-caption font-bold text-foreground">
                          {artikel.penulis.nama}
                        </p>
                        <p className="truncate text-[9px] font-semibold text-muted-foreground">
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
              <div className="rounded-2xl bg-slate-50 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-body font-bold text-foreground">
                    Kategori Populer
                  </h3>
                </div>
                <div className="flex flex-col gap-2.5">
                  {ARTIKEL_KATEGORI_POPULER.map((cat, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="group flex items-center justify-between py-1.5 transition-all"
                    >
                      <span className="text-body-sm text-muted-foreground transition-colors group-hover:text-primary">
                        {cat.label}
                      </span>
                      <span className="text-caption font-semibold text-muted-foreground">
                        {cat.jumlahArtikel}
                      </span>
                    </Link>
                  ))}
                  <Link href="#" className="mt-4 flex items-center gap-1 text-caption font-bold text-primary hover:underline">
                    Lihat Semua Kategori
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Trending Articles */}
              <div>
                <h3 className="mb-6 text-body font-bold text-foreground">
                  Artikel Terpopuler
                </h3>
                <div className="flex flex-col gap-5">
                  {ARTIKEL_TERPOPULER.map((trending, idx) => (
                    <Link
                      key={idx}
                      href="#"
                      className="group flex items-start gap-4"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center text-body-sm font-bold text-foreground">
                        {trending.rank}
                      </span>
                      <div className="flex gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <Image
                            src={`/images/article/hero-bg.webp`}
                            alt={trending.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="mb-1 text-caption font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                            {trending.title}
                          </h4>
                          <p className="text-caption text-muted-foreground">
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
