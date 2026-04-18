"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle2, ShoppingCart } from "lucide-react";
import { showToast } from "@/lib/toast";
import { Product } from "@/constants/types";

interface ProductCardProps {
  product: Product;
}

const formatPrice = (price: number) => {
  if (price >= 1_000_000) {
    const juta = price / 1_000_000;
    return `${juta.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    })} juta`;
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartData = localStorage.getItem('smarttani-cart');
    let cart = cartData ? JSON.parse(cartData) : [];
    
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    localStorage.setItem('smarttani-cart', JSON.stringify(cart));
    showToast(`${product.name} ditambahkan ke keranjang!`, "success");
    window.dispatchEvent(new Event("smarttani-cart-update"));
  };

  return (
    <Link
      href={`/marketplace/${product.id}`}
      className="group flex flex-col h-full bg-white rounded-xl border border-neutral-200/80 overflow-hidden transition-all duration-300 hover:shadow-md hover:border-neutral-300"
    >
      {/* Image */}
      <div className="relative aspect-square w-full bg-[#E6E6E6] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />
        {product.isPromo && (
          <span className="absolute top-2 left-2 bg-green-50 text-green-700 text-[10px] font-medium px-2 py-0.5 rounded-full border border-green-100">
            Promo
          </span>
        )}
        
        {/* Add to Cart Floating Button */}
        <button
          onClick={addToCart}
          className="absolute bottom-2 right-2 size-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-dark cursor-pointer z-10"
          aria-label="Tambah ke keranjang"
        >
          <ShoppingCart className="size-4" />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-2.5 gap-1.5">
        {/* Name */}
        <h3 className="text-[12px] md:text-[13px] font-medium text-neutral-800 line-clamp-2 leading-snug min-h-8.5">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-[#17391f] leading-tight">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-neutral-400 line-through leading-tight">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Rating + Terjual */}
        <div className="flex items-center gap-1">
          <Star className="size-3 fill-yellow-400 text-yellow-400 shrink-0" />
          <span className="text-[11px] text-neutral-500 leading-none">
            {product.rating} · Terjual {product.terjual}
          </span>
        </div>

        {/* Store */}
        <div className="mt-auto pt-2 flex items-center gap-1 border-t border-neutral-100">
          <CheckCircle2 className="size-3 text-primary fill-primary shrink-0" />
          <span className="text-[11px] font-medium text-primary truncate">
            {product.storeType}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
