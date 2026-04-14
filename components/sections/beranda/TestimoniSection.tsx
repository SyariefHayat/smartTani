import {
  ARTICLE_IMAGES,
  CATEGORY_IMAGES,
  HOME_ARTICLE,
  HOME_CATEGORY,
  HOME_TESTIMONI,
  TESTIMONI_AVATARS,
} from "@/constants";
import { Quote, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function TestimoniSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Column 1: Kategori */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-[#17391f] md:text-xl">
                  Kategori Produk Populer
                </h2>
                <p className="text-xs text-[#5d7a64] mt-0.5">
                  Temukan berbagai hasil tani berkualitas
                </p>
              </div>
              <Link
                href="#"
                className="text-xs font-bold text-primary hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {HOME_CATEGORY.slice(0, 6).map((item, index) => (
                <div
                  key={item}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#EAF3DE] border border-gray-100 hover:border-gray-300 hover:bg-[#f6f8f2] transition-all cursor-pointer text-center"
                >
                  <div className="relative w-11 h-11 rounded-lg bg-[#EAF3DE] overflow-hidden flex items-center justify-center">
                    <Image
                      src={
                        CATEGORY_IMAGES[index] ?? "/images/home/padi-gabah.webp"
                      }
                      alt={item}
                      fill
                      className="object-cover p-1.5"
                      sizes="100%"
                    />
                  </div>
                  <p className="text-[11px] font-medium text-[#5d7a64] leading-tight">
                    {item}
                  </p>
                </div>
              ))}

              {/* Item ke-7: full width */}
              {HOME_CATEGORY[6] && (
                <div className="col-span-3 flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-[#EAF3DE] border border-gray-100 hover:border-gray-300 hover:bg-[#f6f8f2] transition-all cursor-pointer">
                  <div className="relative w-9 h-9 rounded-lg bg-[#EAF3DE] overflow-hidden shrink-0">
                    <Image
                      src={CATEGORY_IMAGES[6] ?? "/images/home/padi-gabah.webp"}
                      alt={HOME_CATEGORY[6]}
                      fill
                      className="object-cover p-1.5"
                      sizes="100%"
                    />
                  </div>
                  <p className="text-xs font-medium text-[#5d7a64]">
                    {HOME_CATEGORY[6]}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Testimoni */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-2">
              <Quote className="size-5 fill-[#3B6D11] text-[#3B6D11] shrink-0" />
              <h2 className="text-base font-extrabold text-[#17391f] md:text-lg">
                Testimoni Pengguna
              </h2>
            </div>
            <div className="space-y-4">
              {HOME_TESTIMONI.map((item, index) => (
                <div
                  key={item.name}
                  className="relative rounded-2xl bg-[#EAF3DE] p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 overflow-hidden rounded-full border border-gray-100">
                        <Image
                          src={
                            TESTIMONI_AVATARS[index] ??
                            "/images/about/Placeholder-profesional.jpeg"
                          }
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="100%"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#17391f]">
                          {item.name}
                        </p>
                        <p className="text-[0.65rem] font-medium text-[#5d7a64] md:text-xs">
                          {item.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="size-3 fill-[#f5c35b] text-[#f5c35b]"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed italic text-[#5d7a64] md:text-sm">
                    &quot;{item.quote}&quot;
                  </p>
                </div>
              ))}
              <div className="flex justify-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                <div className="size-2 rounded-full bg-primary/30" />
                <div className="size-2 rounded-full bg-primary/30" />
              </div>
            </div>
          </div>

          {/* Column 3: Artikel */}
          <div className="lg:col-span-4 bg-white">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#17391f] md:text-xl">
                Artikel Terbaru
              </h2>
              <Link
                href="#"
                className="text-xs font-bold text-primary hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="space-y-5">
              {HOME_ARTICLE.map((item, index) => (
                <Link
                  key={item.title}
                  href="#"
                  className="group flex items-start gap-4 transition-transform hover:translate-x-1"
                >
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <Image
                      src={
                        ARTICLE_IMAGES[index] ?? "/images/article/hero-bg.webp"
                      }
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
