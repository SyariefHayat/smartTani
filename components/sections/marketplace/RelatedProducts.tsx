"use client";

import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";
import { MARKETPLACE_TERLARIS_DATA } from "@/constants/marketplace";

export default function RelatedProducts() {
  const relatedProducts = MARKETPLACE_TERLARIS_DATA.items.slice(0, 4);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="mt-16 border-t border-gray-100 pt-16">
      <h2 className="text-2xl font-bold text-gray-900">Produk Serupa</h2>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <Link
            key={product.id}
            href={`/marketplace/${product.id}`}
            className="group block overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden bg-gray-50">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4 transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <div className="text-xs font-medium text-[#1A6B2F]">
                {product.storeType}
              </div>
              <h3 className="mt-1 line-clamp-2 text-sm font-bold text-gray-900 group-hover:text-[#1A6B2F]">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{product.rating}</span>
                <span className="text-[10px] text-gray-500">
                  ({product.terjual})
                </span>
              </div>
              <div className="mt-3 text-base font-bold text-[#1A6B2F]">
                {formatPrice(product.price)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
