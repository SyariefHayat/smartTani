import React from "react";
import { DISTRIBUTOR_PRODUK_KATEGORI } from "@/constants/distributor";

const DistributorProdukKategoriSection = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {DISTRIBUTOR_PRODUK_KATEGORI.heading}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {DISTRIBUTOR_PRODUK_KATEGORI.items.map((item, index) => (
            <div key={index} className="text-center p-4">
              <div className="font-semibold">{item.label}</div>
              <div className="text-sm text-gray-500">{item.jumlahProduk} Produk</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DistributorProdukKategoriSection;
