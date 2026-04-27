"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, Clock, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ArticleHeaderProps {
  article: any;
}

export default function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#5d7a64]">
        <Link href="/" className="flex items-center gap-1 hover:text-primary transition-colors">
          <Home className="h-3 w-3" />
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/articles" className="hover:text-primary transition-colors">
          Artikel
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 font-extrabold text-[#17391f]">
          {article.title}
        </span>
      </nav>

      <div className="max-w-4xl">
        <Badge className="bg-primary !text-white text-[10px] font-extrabold px-3 py-1 border-none rounded-lg shadow-lg mb-6 uppercase tracking-wider">
          {article.kategori}
        </Badge>
        <h1 className="text-3xl font-extrabold md:text-4xl lg:text-5xl text-[#17391f] leading-tight mb-8">
          {article.title}
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-8 border-y border-slate-100 py-8">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-slate-50 shadow-md">
              <Image
                src={article.penulis.avatar}
                alt={article.penulis.nama}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-extrabold text-[#17391f]">
                {article.penulis.nama}
              </div>
              <div className="text-xs font-medium text-[#5d7a64]">
                {article.penulis.gelar}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5d7a64]">
            <Calendar className="h-4 w-4 text-accent" />
            <span>{article.tanggal}</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#5d7a64]">
            <Clock className="h-4 w-4 text-accent" />
            <span>{article.waktuBaca}</span>
          </div>
        </div>

        <div className="relative mt-8 aspect-video overflow-hidden rounded-2xl shadow-lg">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </header>
  );
}
