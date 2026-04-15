import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle2 } from "lucide-react";
import { Product } from "@/constants/types";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace(/,00$/, "");
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#f3f4f6] p-4 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-3">
        {/* Product Name */}
        <Link
          href={`/marketplace/product/${product.id}`}
          className="block mb-1"
        >
          <h3 className="text-[15px] font-bold text-[#17391f] line-clamp-2 leading-tight min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* Product Description */}
        <p className="text-[12px] text-[#5d7a64] line-clamp-2 mb-3 leading-snug min-h-[32px]">
          {product.description}
        </p>

        {/* Price Section */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[16px] font-extrabold text-[#17391f]">
            {formatPrice(product.price).replace("Rp", "Rp ")}
          </span>
          {product.originalPrice && (
            <span className="text-[12px] text-neutral-400 line-through decoration-neutral-400">
              {formatPrice(product.originalPrice).replace("Rp", "Rp ")}
            </span>
          )}
        </div>

        {/* Rating & Sales */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex items-center gap-0.5">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-[12px] font-semibold text-neutral-700">
              {product.rating}
            </span>
          </div>
          <span className="text-[12px] text-neutral-400">|</span>
          <span className="text-[12px] text-neutral-500 font-medium">
            Terjual {product.terjual}
          </span>
        </div>

        {/* Store Label - At Bottom */}
        <div className="mt-auto pt-2 flex items-center gap-1.5 border-t border-neutral-100">
          <CheckCircle2 className="size-3.5 text-primary fill-primary text-white" />
          <span className="text-[12px] font-bold text-primary">
            {product.storeType}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
