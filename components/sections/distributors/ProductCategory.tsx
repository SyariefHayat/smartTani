import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DISTRIBUTOR_PRODUK_KATEGORI } from "@/constants/distributor";

const ProductCategory = () => {
  return (
    <section className="section-padding">
      <div className="container-smarttani">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {DISTRIBUTOR_PRODUK_KATEGORI.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
              {DISTRIBUTOR_PRODUK_KATEGORI.subtext}
            </p>
          </div>
          <Link
            href="/marketplace"
            className="group flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-dark transition-colors md:text-base shrink-0"
          >
            Lihat Semua Produk
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4 md:flex md:overflow-x-auto md:pb-6 md:-mx-4 md:px-4 lg:mx-0 lg:px-0 md:scrollbar-hide md:snap-x lg:grid lg:grid-cols-7 lg:gap-5">
            {DISTRIBUTOR_PRODUK_KATEGORI.items.map((item, index) => (
              <Link
                key={index}
                href={`/marketplace?kategori=${encodeURIComponent(item.label)}`}
                className="md:shrink-0 md:w-48 lg:w-full md:snap-start group cursor-pointer"
              >
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg h-full flex flex-col">
                  {/* Image Container */}
                  <div className="relative aspect-square w-full bg-slate-50 p-4">
                    <Image
                      src={item.image}
                      alt={item.label}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 768px) 192px, (max-width: 1024px) 25vw, 15vw"
                    />
                  </div>

                  {/* Content Container */}
                  <div className="p-4 flex-1 flex flex-col items-center justify-center text-center border-t border-slate-100">
                    <h3 className="text-sm font-extrabold text-[#17391f] leading-tight mb-1">
                      {item.label}
                    </h3>
                    <p className="text-[#5d7a64] text-[10px] font-medium uppercase tracking-wider">
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

export default ProductCategory;
