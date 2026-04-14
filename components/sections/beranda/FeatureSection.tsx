import {
  FEATURES_BG_COLORS,
  FEATURES_IMAGES,
  HOME_FEATURES,
} from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function FeatureSection() {
  return (
    <section className="py-8">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center text-center">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
            Fitur Utama SmartTani
          </h2>
          <p className="mt-4 text-sm font-medium text-[#5d7a64] md:text-base">
            Semua yang Anda butuhkan untuk sukses di dunia pertanian, dalam satu
            platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5 items-stretch">
          {HOME_FEATURES.map((features, index) => (
            <div
              key={features.title}
              className={`flex flex-col h-full p-4 items-center text-center transition-transform hover:-translate-y-1 rounded-xl ${FEATURES_BG_COLORS[index]}`}
            >
              {/* Gambar */}
              <div className="relative size-40 shrink-0">
                <Image
                  src={FEATURES_IMAGES[index]}
                  alt={features.title}
                  fill
                  className="object-contain"
                  sizes="100%"
                />
              </div>

              <div className="flex flex-col flex-1 items-center">
                <h3 className="mb-3 text-lg font-extrabold text-[#17391f]">
                  {features.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#5d7a64] md:text-sm">
                  {features.description}
                </p>
              </div>

              <Link
                href="#"
                className="mt-4 group flex items-center gap-1.5 text-xs font-bold text-primary transition-colors hover:text-primary/80"
              >
                {features.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
