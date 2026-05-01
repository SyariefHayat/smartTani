"use client";

import Link from "next/link";
import { MARKETPLACE_TERLARIS_DATA } from "@/constants/marketplace";
import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

const BestSelling = () => {
  const { heading, items, cta } = MARKETPLACE_TERLARIS_DATA;

  const getRankBadgeStyles = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-400 text-yellow-900";
      case 1:
        return "bg-slate-300 text-slate-700";
      case 2:
        return "bg-amber-600 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-bold text-[#17391f]">
          {heading}
        </h2>
        <Link
          href="/marketplace?sort=terlaris"
          className="text-primary text-xs md:text-sm font-semibold hover:underline flex items-center gap-1"
        >
          {cta} <span className="text-lg leading-none">→</span>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {items.slice(0, 6).map((product, index) => (
          <div key={product.id} className="relative">
            <ProductCard product={product} />

            {/* Rank Badge for Top 3 */}
            {index < 3 && (
              <div
                className={cn(
                  "absolute top-2 right-2 z-10 size-6 md:size-7 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold shadow-md pointer-events-none",
                  getRankBadgeStyles(index),
                )}
              >
                {index + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BestSelling;
