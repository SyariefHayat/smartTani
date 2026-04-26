import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DISTRIBUTOR_PRODUK_KATEGORI } from "@/constants/distributor";

const DistributorProdukKategoriSection = () => {
  return (
    <section className="">
      <div className="container-smarttani">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {DISTRIBUTOR_PRODUK_KATEGORI.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
              {DISTRIBUTOR_PRODUK_KATEGORI.subtext}
            </p>
          </div>
          <Link
            href="/marketplace"
            className="text-xs font-bold text-primary hover:underline group shrink-0"
          >
            Lihat Semua Produk →
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x gap-4 md:grid md:grid-cols-4 lg:grid-cols-7 lg:gap-5">
            {DISTRIBUTOR_PRODUK_KATEGORI.items.map((item, index) => (
              <Link
                key={index}
                href={`/marketplace?kategori=${encodeURIComponent(item.label)}`}
                className="shrink-0 w-48 md:w-full snap-start group cursor-pointer"
              >
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg group-hover:-translate-y-1 h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-slate-50 p-4">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 192px, (max-width: 1024px) 25vw, 15vw"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center border-t border-slate-100">
                    <h3 className="text-sm font-bold text-[#17391f] leading-tight mb-1">
                      {item.label}
                    </h3>
                    <p className="text-[10px] font-medium text-[#5d7a64]">
                      {item.jumlahProduk} Produk
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributorProdukKategoriSection;
