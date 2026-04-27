"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ARTICLE_ITEMS,
  ARTICLE_POPULAR_CATEGORIES,
  ARTICLE_MOST_POPULAR
} from "@/constants/article";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight, Search, SearchX } from "lucide-react";
import { slugify } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function ArtikelLayoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const kategori = searchParams.get("kategori") || "";

  const [searchQuery, setSearchQuery] = useState(q);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    router.push(`/articles?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setSearchQuery("");
    router.push("/articles", { scroll: false });
  };

  let filteredArticles = ARTICLE_ITEMS;

  if (q) {
    filteredArticles = filteredArticles.filter((a) =>
      a.title.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (kategori) {
    filteredArticles = filteredArticles.filter(
      (a) => a.kategori.toLowerCase() === kategori.toLowerCase()
    );
  }

  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* Main Content: Article Grid */}
          <div className="flex-1 lg:max-w-[75%]">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
                {kategori ? `Artikel Kategori: ${kategori}` : "Artikel Terbaru"}
              </h2>

              <form onSubmit={handleSearch} className="relative w-full sm:w-auto sm:min-w-[350px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#5d7a64]" />
                <Input
                  type="search"
                  placeholder="Cari artikel berdasarkan judul..."
                  className="pl-11 pr-24 h-12 bg-slate-50 border-slate-200 rounded-xl text-sm font-medium focus:bg-white transition-all shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 top-1.5 h-9 bg-primary !text-white rounded-lg px-5 text-xs font-bold shadow-md shadow-primary/10 cursor-pointer"
                >
                  Cari
                </Button>
              </form>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {filteredArticles.map((artikel, index) => (
                  <Link
                    key={index}
                    href={`/articles/${slugify(artikel.title)}`}
                    className="group flex flex-col h-full overflow-hidden rounded-lg border border-slate-100 bg-white transition-all hover:shadow-xl hover:-translate-y-1"
                  >
                    <article className="flex flex-col h-full">
                      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
                        <Image
                          src={artikel.image}
                          alt={artikel.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute left-3 top-3">
                          <Badge className="bg-primary !text-white text-[10px] font-extrabold px-2.5 py-1 border-none rounded-lg shadow-lg">
                            {artikel.kategori}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-wider text-[#5d7a64]">
                          <span>{artikel.tanggal}</span>
                          <span className="text-slate-300">•</span>
                          <span>{artikel.waktuBaca}</span>
                        </div>

                        <h3 className="mb-3 text-base font-extrabold leading-tight text-[#17391f] grow transition-colors group-hover:text-primary">
                          {artikel.title}
                        </h3>

                        <p className="mb-5 line-clamp-2 text-xs font-medium text-[#5d7a64] leading-relaxed shrink-0">
                          {artikel.description}
                        </p>

                        <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4 shrink-0">
                          <Avatar className="size-8 ring-2 ring-slate-50">
                            <AvatarImage src={artikel.penulis.avatar} alt={artikel.penulis.nama} />
                            <AvatarFallback className="bg-primary/10 text-[10px] font-bold text-primary">
                              {artikel.penulis.nama.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="overflow-hidden">
                            <p className="truncate text-xs font-extrabold text-[#17391f]">
                              {artikel.penulis.nama}
                            </p>
                            <p className="truncate text-[10px] font-medium text-[#5d7a64]">
                              {artikel.penulis.gelar}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                <SearchX className="size-20 text-slate-300 mb-6" />
                <h3 className="text-xl font-extrabold text-[#17391f]">Tidak ada artikel ditemukan.</h3>
                <p className="text-sm font-medium text-[#5d7a64] mt-2 mb-8 max-w-md">
                  Coba ubah filter kategori atau kata kunci pencarian Anda untuk menemukan artikel yang sesuai.
                </p>
                <Button
                  onClick={handleReset}
                  className="bg-primary hover:bg-primary-dark !text-white rounded-xl px-8 h-12 font-bold shadow-lg shadow-primary/20"
                >
                  Lihat Semua Artikel
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          {/* ✅ Di tablet (md-lg): sidebar full width dengan layout 2 kolom berdampingan */}
          <aside className="w-full lg:w-[25%] lg:shrink-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 lg:gap-10">

              {/* Popular Categories */}
              <div className="rounded-3xl bg-slate-50 p-5 md:p-7 border border-slate-100">
                <h3 className="mb-4 md:mb-5 text-base md:text-xl lg:text-lg font-extrabold text-[#17391f]">
                  Kategori Populer
                </h3>
                <div className="flex flex-col">
                  {ARTICLE_POPULAR_CATEGORIES.map((cat, idx) => (
                    <button
                      key={idx}
                      onClick={() => router.push(`/articles?kategori=${cat.label}`)}
                      className="group flex items-center justify-between py-2 md:py-2.5 transition-all text-left cursor-pointer border-b border-slate-100 last:border-none"
                    >
                      <span className="text-sm md:text-base lg:text-sm font-bold text-[#5d7a64] transition-colors group-hover:text-primary">
                        {cat.label}
                      </span>
                      <span className="text-xs md:text-sm lg:text-xs font-extrabold text-[#17391f] bg-white px-2.5 py-0.5 md:py-1 rounded-lg border border-slate-100 shadow-sm">
                        {cat.jumlahArtikel}
                      </span>
                    </button>
                  ))}
                  <button
                    onClick={handleReset}
                    className="mt-4 md:mt-5 flex items-center gap-1.5 text-xs md:text-sm lg:text-xs font-extrabold text-primary hover:underline cursor-pointer text-left uppercase tracking-wider"
                  >
                    Lihat Semua Kategori
                    <ChevronRight className="size-3.5 md:size-4 lg:size-3.5" />
                  </button>
                </div>
              </div>

              {/* Trending Articles */}
              <div>
                {/* ✅ Judul lebih besar di tablet */}
                <h3 className="mb-6 md:mb-8 text-base md:text-xl lg:text-lg font-extrabold text-[#17391f]">
                  Artikel Terpopuler
                </h3>
                <div className="flex flex-col gap-5 md:gap-6">
                  {ARTICLE_MOST_POPULAR.map((trending, idx) => (
                    <Link
                      key={idx}
                      href={`/articles/${slugify(trending.title)}`}
                      className="group flex items-start gap-3 md:gap-4"
                    >
                      {/* ✅ Rank badge lebih besar di tablet */}
                      <span className="flex size-7 md:size-9 lg:size-7 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-xs md:text-sm lg:text-xs font-extrabold text-primary">
                        {trending.rank}
                      </span>
                      <div className="flex gap-3 md:gap-4">
                        {/* ✅ Thumbnail lebih besar di tablet */}
                        <div className="relative size-16 md:size-20 lg:size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-50 shadow-sm">
                          <Image
                            src={`/images/article/hero-bg.webp`}
                            alt={trending.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0 flex flex-col justify-center">
                          {/* ✅ Judul artikel lebih besar dan tidak terpotong di tablet */}
                          <h4 className="mb-1.5 text-xs md:text-sm lg:text-xs font-extrabold leading-tight text-[#17391f] transition-colors group-hover:text-primary line-clamp-2">
                            {trending.title}
                          </h4>
                          <p className="text-[10px] md:text-xs lg:text-[10px] font-bold uppercase tracking-wider text-[#5d7a64]">
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
}

const ArticleLayoutSection = () => {
  return (
    <Suspense fallback={<div className="h-96 bg-white animate-pulse"></div>}>
      <ArtikelLayoutContent />
    </Suspense>
  );
};

export default ArticleLayoutSection;