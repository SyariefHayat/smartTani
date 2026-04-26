import {
  FEATURES_BG_COLORS,
  FEATURES_IMAGES,
  HOME_FEATURES,
} from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function FeatureSection() {
  const getHref = (cta: string) => {
    if (cta.includes("Lihat Produk")) return "/marketplace";
    if (cta.includes("Mulai Investasi")) return "/investments";
    if (cta.includes("Jelajahi")) return "/distributors";
    if (cta.includes("Cek Tarif")) return "/logistics";
    if (cta.includes("Mulai Belajar")) return "/academy";
    return "/";
  };

  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-6 md:mb-10 flex flex-col items-center text-center">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
            Fitur Utama SmartTani
          </h2>
          <p className="mt-1 text-sm font-medium text-[#5d7a64] md:text-base">
            Semua yang Anda butuhkan untuk sukses di dunia pertanian, dalam satu
            platform.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:gap-10 lg:gap-6 sm:grid-cols-3 lg:grid-cols-6 items-stretch">
          {HOME_FEATURES.map((features, index) => (
            <Link
              key={features.title}
              href={getHref(features.cta)}
              className={`flex flex-col h-full p-4 items-center text-center transition-transform hover:-translate-y-1 rounded-xl ${FEATURES_BG_COLORS[index]}`}
            >
              {/* Gambar */}
              <div className="relative w-full size-40 shrink-0 -mt-5 lg:-mt-7">
                <Image
                  src={FEATURES_IMAGES[index]}
                  alt={`Ikon fitur ${features.title}`}
                  fill
                  className="object-contain lg:object-contain"
                  sizes="100%"
                />
              </div>

              <div className="flex flex-col flex-1 items-center -mt-5 md:-mt-3 lg:-mt-7">
                <h3 className="mb-2 md:mb-4 text-lg font-extrabold text-[#17391f]">
                  {features.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#5d7a64] md:text-sm line-clamp-3 lg:-mt-2">
                  {features.description}
                </p>
              </div>

              <span
                aria-label={`${features.cta} - ${features.title}`}
                className="mt-4 group flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-primary/80"
              >
                {features.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
