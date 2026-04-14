import Image from "next/image";
import Link from "next/link";
import { HOME_FITUR } from "@/constants";
import { Sprout } from "lucide-react";

const FITUR_IMAGES = [
  "/images/home/keranjang-belanja.webp",
  "/images/home/grafik-investasi.webp",
  "/images/home/gudang-truk.webp",
  "/images/home/truk-logistik.webp",
  "/images/home/buku-akademi.webp",
];

const FITUR_BG_COLORS = [
  "bg-[#EAF3DE]",
  "bg-[#FAEEDA]",
  "bg-[#E6F1FB]",
  "bg-[#F3E8FB]",
  "bg-[#F1EFE8]",
];

export default function FiturSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-3xl font-extrabold text-[#3B6D11]">&quot;</span>
            <div className="flex items-center gap-2 rounded-full border border-[#b5d296]/30 bg-[#f6f8f2] px-4 py-1.5">
              <Sprout className="size-5 text-[#3B6D11]" />
              <h2 className="text-lg font-bold text-[#17391f] md:text-xl">
                Fitur Utama Smarttani
              </h2>
            </div>
            <span className="text-3xl font-extrabold text-[#3B6D11]">&quot;</span>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-[#5d7a64] md:text-base">
            Semua yang Anda butuhkan untuk sukses di dunia pertanian, dalam satu
            platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {HOME_FITUR.map((fitur, index) => (
            <div
              key={fitur.title}
              className="flex flex-col items-center text-center transition-transform hover:-translate-y-1"
            >
              <div
                className={`mb-6 flex size-32 items-center justify-center rounded-2xl shadow-sm ${FITUR_BG_COLORS[index]}`}
              >
                <div className="relative size-20">
                  <Image
                    src={FITUR_IMAGES[index]}
                    alt={fitur.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <h3 className="mb-3 text-lg font-extrabold text-[#17391f]">
                {fitur.title}
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-[#5d7a64] md:text-sm">
                {fitur.description}
              </p>
              <Link
                href="#"
                className="group flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-primary/80"
              >
                {fitur.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
