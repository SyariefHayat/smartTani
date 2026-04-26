"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";
import { ARTICLE_DUMMY } from "@/constants/article";

export default function RelatedArticles() {
  const relatedArticles = ARTICLE_DUMMY.slice(0, 3);

  return (
    <div className="mt-20 border-t border-gray-100 pt-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Artikel Terkait</h2>
        <Link 
          href="/artikel" 
          className="flex items-center gap-1 text-sm font-bold text-[#1A6B2F] hover:underline"
        >
          Lihat Semua Artikel
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedArticles.map((article, i) => (
          <Link
            key={i}
            href={`/artikel/${i + 1}`}
            className="group block overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-xl"
          >
            <div className="relative aspect-[16/9] overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-6">
              <div className="text-xs font-bold text-[#BA7517] uppercase tracking-wider">
                {article.kategori}
              </div>
              <h3 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-[#1A6B2F]">
                {article.title}
              </h3>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{article.tanggal}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{article.waktuBaca}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
