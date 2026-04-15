"use client";

import Link from "next/link";
import Image from "next/image";
import { MARKETPLACE_KATEGORI_POPULER } from "@/constants/marketplace";

const CategorySection = () => {
  const generateSlug = (label: string) => {
    return label.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-");
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#17391f]">
          Kategori Populer
        </h2>
        <Link
          href="/marketplace/categories"
          className="text-primary text-xs md:text-sm font-semibold hover:underline flex items-center gap-1"
        >
          Lihat Semua <span className="text-lg leading-none">→</span>
        </Link>
      </div>

      <div className="flex justify-between gap-2 md:gap-3">
        {MARKETPLACE_KATEGORI_POPULER.map((category) => {
          const slug = generateSlug(category.label);
          const isLast = category.label === "Lainnya";

          return (
            <Link
              key={category.label}
              href={
                isLast
                  ? "/marketplace/categories"
                  : `/marketplace?kategori=${slug}`
              }
              className="group flex flex-col items-center text-center gap-2.5 transition-all duration-200 flex-1"
            >
              {/* Circular Image Container */}
              <div className="relative size-14 md:size-16 lg:size-20 rounded-full border border-neutral-100 p-1 bg-white overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:scale-105 group-hover:shadow-md">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-neutral-50">
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 12vw, 8vw"
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] md:text-xs font-bold text-[#17391f] group-hover:text-primary transition-colors line-clamp-1">
                  {category.label}
                </span>
                <span className="text-[9px] md:text-[10px] text-muted-foreground font-medium">
                  {category.jumlahProduk || category.sublabel}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategorySection;
