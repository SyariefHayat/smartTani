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
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="section-title text-foreground">
              {DISTRIBUTOR_PRODUK_KATEGORI.heading}
            </h2>
            <p className="text-body-lg mt-4 text-muted-foreground">
              {DISTRIBUTOR_PRODUK_KATEGORI.subtext}
            </p>
          </div>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-bold text-body transition-colors group shrink-0"
          >
            Lihat Semua Produk
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="relative">
          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide snap-x gap-4 md:grid md:grid-cols-4 lg:grid-cols-7 lg:gap-5">
            {DISTRIBUTOR_PRODUK_KATEGORI.items.map((item, index) => (
              <div
                key={index}
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
                    <h3 className="font-bold text-foreground text-body-sm md:text-body leading-tight mb-1">
                      {item.label}
                    </h3>
                    <p className="text-muted-foreground text-caption md:text-body-sm">
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
