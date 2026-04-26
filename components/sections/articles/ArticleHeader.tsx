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
      <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="flex items-center gap-1 hover:text-[#1A6B2F]">
          <Home className="h-3 w-3" />
          Beranda
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/artikel" className="hover:text-[#1A6B2F]">
          Artikel
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="line-clamp-1 font-medium text-gray-900">
          {article.title}
        </span>
      </nav>

      <div className="max-w-4xl">
        <Badge className="bg-[#BA7517] hover:bg-[#a06514] mb-4">
          {article.kategori}
        </Badge>
        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl text-gray-900 leading-tight">
          {article.title}
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-gray-100 py-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-gray-200">
              <Image
                src={article.penulis.avatar}
                alt={article.penulis.nama}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">
                {article.penulis.nama}
              </div>
              <div className="text-xs text-gray-500">
                {article.penulis.gelar}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{article.tanggal}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
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
