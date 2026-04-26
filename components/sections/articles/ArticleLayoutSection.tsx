"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ARTICLE_DUMMY,
  ARTIKEL_KATEGORI_POPULER,
  ARTIKEL_TERPOPULER
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
    router.push(`/artikel?${params.toString()}`, { scroll: false });
  };

  const handleReset = () => {
    setSearchQuery("");
    router.push("/artikel", { scroll: false });
  };

  let filteredArticles = ARTICLE_DUMMY;

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
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">

          {/* Main Content: Article Grid */}
          <div className="flex-1 lg:max-w-[75%]">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-heading-2 font-bold text-foreground">
                {kategori ? `Artikel Kategori: ${kategori}` : "Artikel Terbaru"}
              </h2>
              
              <form onSubmit={handleSearch} className="relative w-full sm:w-auto sm:min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari artikel berdasarkan judul..."
                  className="pl-10 pr-20 h-10 bg-slate-50 border-slate-200 rounded-full text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-full px-4 text-xs cursor-pointer"
                >
                  Cari
                </Button>
              </form>
            </div>

            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {filteredArticles.map((artikel, index) => (
                  <Link
                    key={index}
                    href={`/artikel/${slugify(artikel.title)}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:shadow-lg"
                  >
                    <article className="flex flex-col h-full">
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
                          {artikel.title}
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
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                <SearchX className="h-16 w-16 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Tidak ada artikel ditemukan untuk pencarian ini.</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6 max-w-md">
                  Coba ubah filter kategori atau kata kunci pencarian Anda untuk menemukan artikel yang sesuai.
                </p>
                <Button 
                  onClick={handleReset}
                  className="bg-primary hover:bg-primary-dark text-white rounded-full px-6"
                >
                  Lihat Semua Artikel
                </Button>
              </div>
            )}
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
                    <button
                      key={idx}
                      onClick={() => router.push(`/artikel?kategori=${cat.label}`)}
                      className="group flex items-center justify-between py-1.5 transition-all text-left"
                    >
                      <span className="text-body-sm text-muted-foreground transition-colors group-hover:text-primary">
                        {cat.label}
                      </span>
                      <span className="text-caption font-semibold text-muted-foreground">
                        {cat.jumlahArtikel}
                      </span>
                    </button>
                  ))}
                  <button onClick={handleReset} className="mt-4 flex items-center gap-1 text-caption font-bold text-primary hover:underline cursor-pointer text-left">
                    Lihat Semua Kategori
                    <ChevronRight className="h-3 w-3" />
                  </button>
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
                      href={`/artikel/${slugify(trending.title)}`}
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
}

const ArticleLayoutSection = () => {
  return (
    <Suspense fallback={<div className="h-96 bg-white animate-pulse"></div>}>
      <ArtikelLayoutContent />
    </Suspense>
  );
};

export default ArticleLayoutSection;
