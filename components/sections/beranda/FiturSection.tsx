import { HOME_FITUR } from "@/constants";
import { Sprout } from "lucide-react";
import { FiturCard } from "./FiturCard";

const FITUR_IMAGES = [
  "/images/home/keranjang-belanja.webp",
  "/images/home/grafik-investasi.webp",
  "/images/home/gudang-truk.webp",
  "/images/home/truk-logistik.webp",
  "/images/home/buku-akademi.webp",
];

export default function FiturSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-2">
            <Sprout className="size-6 text-[#3B6D11]" />
            <h2 className="text-xl font-extrabold text-[#17391f] md:text-2xl">
              Fitur Utama Smarttani
            </h2>
            <span className="text-3xl font-extrabold text-[#b5d296] opacity-50">&quot;&quot;</span>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-[#5d7a64] md:text-base">
            Semua yang Anda butuhkan untuk sukses di dunia pertanian, dalam satu
            platform.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {HOME_FITUR.map((fitur, index) => (
            <FiturCard
              key={fitur.title}
              title={fitur.title}
              description={fitur.description}
              cta={fitur.cta}
              image={FITUR_IMAGES[index]}
              bgColor={fitur.bgColor!}
              textColor={fitur.textColor!}
              isHighlighted={index === 1} // Highlight the second card (Investasi Pertanian)
            />
          ))}
        </div>
      </div>
    </section>
  );
}
