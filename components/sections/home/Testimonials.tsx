"use client";

import {
  ARTICLE_IMAGES,
  CATEGORY_BG_COLORS,
  CATEGORY_IMAGES,
  HOME_ARTICLE,
  HOME_CATEGORIES,
  HOME_TESTIMONIALS,
  TESTIMONI_AVATARS,
} from "@/constants";
import { Play, Quote, Star, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { slugify } from "@/lib/utils";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoId, setVideoId] = useState<string | null>(null);

  return (
    <>
      {/* Modal Video */}
      {videoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setVideoId(null)}
        >
          <div
            className="relative w-full max-w-3xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoId(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Tutup video"
            >
              <X className="size-7" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title="YouTube video"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full rounded-xl"
            />
          </div>
        </div>
      )}

      <section>
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
          <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-12">

            {/* Column 1: Kategori */}
            <div className="lg:col-span-4">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-[#17391f] md:text-3xl lg:text-lg">
                    Kategori Produk Populer
                  </h2>
                  <p className="text-xs md:text-base lg:text-xs text-[#5d7a64] mt-0.5">
                    Temukan berbagai hasil tani berkualitas
                  </p>
                </div>
                <Link
                  href="/marketplace"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Lihat Semua →
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {HOME_CATEGORIES.slice(0, 6).map((item, index) => (
                  <Link
                    key={item}
                    href={`/marketplace?kategori=${item}`}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-gray-300 transition-all cursor-pointer text-center hover:-translate-y-1"
                    style={{ backgroundColor: CATEGORY_BG_COLORS[index] ?? "#EAF3DE" }}
                  >
                    <div className="relative w-12 h-12">
                      <Image
                        src={CATEGORY_IMAGES[index] ?? "/images/home/padi-gabah.webp"}
                        alt={`Kategori ${item}`}
                        fill
                        className="object-contain"
                        sizes="100%"
                      />
                    </div>
                    <p className="text-[11px] font-medium text-[#5d7a64] leading-tight">
                      {item}
                    </p>
                  </Link>
                ))}

                {HOME_CATEGORIES[6] && (
                  <Link
                    href={`/marketplace?kategori=${HOME_CATEGORIES[6]}`}
                    className="col-span-3 flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-gray-100 hover:border-gray-300 transition-all cursor-pointer hover:-translate-y-1"
                    style={{ backgroundColor: CATEGORY_BG_COLORS[6] ?? "#EAF3DE" }}
                  >
                    <div className="relative w-5 h-5">
                      <Image
                        src={CATEGORY_IMAGES[6] ?? "/images/home/padi-gabah.webp"}
                        alt={`Kategori ${HOME_CATEGORIES[6]}`}
                        fill
                        className="object-contain"
                        sizes="100%"
                      />
                    </div>
                    <p className="text-xs font-medium text-[#5d7a64]">
                      {HOME_CATEGORIES[6]}
                    </p>
                  </Link>
                )}
              </div>
            </div>

            {/* Column 2: Testimoni */}
            <div className="lg:col-span-4">
              <div className="mb-6 flex items-center gap-2">
                <Quote
                  className="size-5 fill-[#3B6D11] text-[#3B6D11] shrink-0"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-extrabold text-[#17391f] md:text-3xl lg:text-lg">
                  Testimoni Pengguna
                </h2>
              </div>
              <div className="space-y-4">
                <div
                  className="relative rounded-2xl bg-[#EAF3DE] p-6 shadow-sm min-h-[160px] flex flex-col justify-center"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 overflow-hidden rounded-full border border-gray-100">
                        <Image
                          src={
                            TESTIMONI_AVATARS[activeIndex] ??
                            "/images/about/placeholder-professional.jpeg"
                          }
                          alt={`Foto profil ${HOME_TESTIMONIALS[activeIndex].name}`}
                          fill
                          className="object-cover"
                          sizes="100%"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#17391f]">
                          {HOME_TESTIMONIALS[activeIndex].name}
                        </p>
                        <p className="text-[0.65rem] font-medium text-[#5d7a64] md:text-xs">
                          {HOME_TESTIMONIALS[activeIndex].role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5" aria-label="Rating 5 bintang">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-[#f5c35b] text-[#f5c35b]"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed italic text-[#5d7a64] md:text-sm">
                    &quot;{HOME_TESTIMONIALS[activeIndex].quote}&quot;
                  </p>
                </div>
                <div className="flex justify-center gap-2">
                  {HOME_TESTIMONIALS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`size-2 rounded-full transition-all ${activeIndex === index ? "bg-primary w-4" : "bg-primary/30"
                        }`}
                      aria-label={`Lihat testimoni ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Artikel */}
            <div className="lg:col-span-4 bg-white">
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-[#17391f] md:text-3xl lg:text-lg">
                  Artikel Terbaru
                </h2>
                <Link
                  href="/articles"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Lihat Semua →
                </Link>
              </div>
              <div className="space-y-5">
                {HOME_ARTICLE.map((item, index) => {
                  const youtubeId = (item as any).youtubeId as string | undefined;

                  return (
                    <Link
                      key={item.title}
                      href={`/articles/${slugify(item.title)}`}
                      aria-label={`Baca artikel: ${item.title}`}
                      className="group flex items-start gap-4"
                    >
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                        <Image
                          src={
                            youtubeId
                              ? `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`
                              : ARTICLE_IMAGES[index] ?? "/images/article/hero-bg.webp"
                          }
                          alt={`Thumbnail artikel ${item.title}`}
                          fill
                          className="object-cover"
                          sizes="100%"
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h3 className="line-clamp-2 text-sm font-extrabold text-[#17391f] transition-colors group-hover:text-primary">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-[0.65rem] font-medium text-[#5d7a64] md:text-xs">
                          {item.date}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}