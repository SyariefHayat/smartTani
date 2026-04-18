"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface ProductTabsProps {
  description: string;
}

export default function ProductTabs({ description }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("deskripsi");

  const tabs = [
    { id: "deskripsi", label: "Deskripsi" },
    { id: "spesifikasi", label: "Spesifikasi" },
    { id: "ulasan", label: "Ulasan" },
  ];

  return (
    <div className="mt-12">
      <div className="flex border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "border-b-2 border-[#1A6B2F] text-[#1A6B2F]"
                : "text-gray-500 hover:text-[#1A6B2F]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="py-8">
        {activeTab === "deskripsi" && (
          <div className="prose max-w-none text-gray-600">
            <p>{description}</p>
            <p className="mt-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          </div>
        )}

        {activeTab === "spesifikasi" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "Kategori", value: "Alat & Mesin Pertanian" },
              { label: "Berat", value: "500g" },
              { label: "Dimensi", value: "20cm x 15cm x 10cm" },
              { label: "Asal Produk", value: "Dalam Negeri" },
              { label: "Masa Garansi", value: "12 Bulan" },
              { label: "Stok", value: "99" },
            ].map((spec, i) => (
              <div key={i} className="flex border-b border-gray-100 pb-2">
                <span className="w-1/3 text-sm text-gray-500">{spec.label}</span>
                <span className="w-2/3 text-sm font-medium text-gray-900">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === "ulasan" && (
          <div className="space-y-8">
            {[
              {
                name: "Budi Santoso",
                rating: 5,
                comment: "Produk sangat berkualitas, pengiriman cepat sampai.",
                date: "2 hari yang lalu",
              },
              {
                name: "Siti Aminah",
                rating: 4,
                comment: "Barang sesuai pesanan, respon penjual sangat baik.",
                date: "1 minggu yang lalu",
              },
              {
                name: "Agus Wijaya",
                rating: 5,
                comment: "Sangat membantu pekerjaan tani saya. Terima kasih!",
                date: "2 minggu yang lalu",
              },
            ].map((review, i) => (
              <div key={i} className="flex gap-4 border-b border-gray-100 pb-6">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                  {review.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-gray-900">
                      {review.name}
                    </h4>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
