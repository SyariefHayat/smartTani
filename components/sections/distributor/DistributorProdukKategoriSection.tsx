import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DISTRIBUTOR_PRODUK_KATEGORI } from "@/constants/distributor";

const DistributorProdukKategoriSection = () => {
  return (
    <section className="bg-white py-8">
      <div className="container-smarttani">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl lg:text-4xl">
              {DISTRIBUTOR_PRODUK_KATEGORI.heading}
            </h2>
            <p className="text-sm font-medium text-[#5d7a64] md:text-base">
              {DISTRIBUTOR_PRODUK_KATEGORI.subtext}
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-sm transition-colors group"
          >
            Lihat Semua Produk
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid/Carousel */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x gap-4 md:grid md:grid-cols-4 lg:grid-cols-7 lg:gap-5">
            {DISTRIBUTOR_PRODUK_KATEGORI.items.map((item, index) => (
              <div
                key={index}
                className="shrink-0 w-48 md:w-full snap-start group cursor-pointer"
              >
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-card group-hover:-translate-y-1 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-neutral-50 p-4">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 192px, (max-width: 1024px) 25vw, 15vw"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center border-t border-neutral-100">
                    <h3 className="font-bold text-neutral-900 text-sm md:text-base leading-tight mb-1">
                      {item.label}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm font-medium">
                      {item.jumlahProduk} Produk
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributorProdukKategoriSection;
