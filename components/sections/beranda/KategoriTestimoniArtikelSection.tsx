import { HOME_ARTIKEL, HOME_KATEGORI, HOME_TESTIMONI } from "@/constants";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const KATEGORI_IMAGES = [
  "/images/home/padi-gabah.webp",
  "/images/home/beras.webp",
  "/images/home/jagung.webp",
  "/images/home/sayur.webp",
  "/images/home/buah.webp",
  "/images/home/kedelai.webp",
  "/images/home/komoditas-lokal.webp",
];

const ARTIKEL_IMAGES = [
  "/images/article/kualitas-hasil-panen.webp",
  "/images/article/kelola-keuangan.webp",
  "/images/article/teknologi-drone.webp",
];

const TESTIMONI_AVATARS = [
  "/images/about/pimpinan-siti-aminah.jpeg",
  "/images/about/pimpinan-budi-santoso.jpeg",
];

export default function KategoriTestimoniArtikelSection() {
  return (
    <section className="bg-[#f6f8f2]/30 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Column 1: Kategori */}
          <div className="lg:col-span-3">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#17391f] md:text-xl">
                Kategori Produk Populer
              </h2>
              <Link
                href="#"
                className="text-xs font-bold text-primary hover:underline"
              >
                Lihat Semua →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-2">
              {HOME_KATEGORI.map((item, index) => (
                <div
                  key={item}
                  className="flex flex-col items-center gap-2 text-center"
                >
                  <div className="relative size-16 overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm transition-transform hover:scale-110 md:size-20">
                    <Image
                      src={KATEGORI_IMAGES[index] ?? "/images/home/padi-gabah.webp"}
                      alt={item}
                      fill
                      className="object-cover p-2"
                    />
                  </div>
                  <p className="text-[0.65rem] font-bold text-[#5d7a64] md:text-xs">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Testimoni */}
          <div className="lg:col-span-5">
            <div className="mb-8 flex items-center gap-2">
              <span className="text-3xl font-extrabold text-[#3B6D11]">&quot;</span>
              <h2 className="text-lg font-extrabold text-[#17391f] md:text-xl">
                Testimoni Pengguna
              </h2>
              <span className="text-3xl font-extrabold text-[#3B6D11]">&quot;</span>
            </div>
            <div className="space-y-6">
              {HOME_TESTIMONI.map((item, index) => (
                <div
                  key={item.name}
                  className="relative rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 overflow-hidden rounded-full border border-gray-100">
                        <Image
                          src={TESTIMONI_AVATARS[index] ?? "/images/about/Placeholder-profesional.jpeg"}
                          alt={item.name}
                          fill
                          className="object-cover"
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
          <div className="lg:col-span-4">
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
              {HOME_ARTIKEL.map((item, index) => (
                <Link
                  key={item.title}
                  href="#"
                  className="group flex items-start gap-4 transition-transform hover:translate-x-1"
                >
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <Image
                      src={ARTIKEL_IMAGES[index] ?? "/images/article/hero-bg.webp"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-110"
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
