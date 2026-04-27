"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChevronRight } from "lucide-react";
import { ARTICLE_ITEMS } from "@/constants/article";
import { slugify } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default function RelatedArticles() {
  const relatedArticles = ARTICLE_ITEMS.slice(0, 3);

  return (
    <div className="mt-20 border-t border-slate-100 pt-20">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-2xl font-extrabold text-[#17391f]">Artikel Terkait</h2>
        <Link 
          href="/articles" 
          className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-primary hover:underline"
        >
          Lihat Semua Artikel
          <ChevronRight className="size-4" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedArticles.map((article, i) => (
          <Link
            key={i}
            href={`/articles/${slugify(article.title)}`}
            className="group block overflow-hidden rounded-3xl border border-slate-100 bg-white transition-all hover:shadow-2xl hover:-translate-y-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute left-4 top-4">
                <Badge className="bg-primary !text-white text-[10px] font-extrabold px-3 py-1 border-none rounded-lg shadow-lg">
                  {article.kategori}
                </Badge>
              </div>
            </div>
            <div className="p-8">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-widest text-[#5d7a64]">
                <span>{article.tanggal}</span>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{article.waktuBaca}</span>
                </div>
              </div>
              <h3 className="line-clamp-2 text-lg font-extrabold leading-tight text-[#17391f] group-hover:text-primary transition-colors min-h-[3rem]">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
