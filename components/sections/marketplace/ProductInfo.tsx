"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Minus, Plus, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { showToast } from "@/lib/toast";
import { Product } from "@/constants/types";

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const maxStock = 99; // Fallback stock

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const addToCart = () => {
    let currentCart: any[] = [];
    try {
      const storedCart = localStorage.getItem("smarttani-cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        if (Array.isArray(parsedCart)) {
          currentCart = parsedCart;
        }
      }
    } catch (error) {
      console.error("Error parsing cart from localStorage", error);
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      qty: qty,
      image: product.image,
      seller: product.storeName,
    };

    // Check if item already exists
    const existingItemIndex = currentCart.findIndex((item: any) => item.id === product.id);
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].qty += qty;
    } else {
      currentCart.push(cartItem);
    }

    localStorage.setItem("smarttani-cart", JSON.stringify(currentCart));
    showToast("Produk berhasil ditambahkan ke keranjang!", "success");
    window.dispatchEvent(new Event("smarttani-cart-update"));
  };

  const buyNow = () => {
    addToCart();
    router.push("/marketplace");
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="mt-2 flex items-center gap-4">
          <Badge className="bg-[#1A6B2F] hover:bg-[#145224]">
            {product.storeType}
          </Badge>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-gray-500">({product.terjual} terjual)</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-bold text-[#1A6B2F]">
          {formatPrice(product.price)}
        </div>
        {product.originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <Badge variant="destructive" className="text-[10px]">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </Badge>
          </div>
        )}
      </div>

      <div className="space-y-4 border-y border-gray-100 py-6">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Jumlah:</span>
          <div className="flex items-center rounded-lg border border-gray-200">
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="p-2 text-gray-600 hover:text-[#1A6B2F]"
            >
              <Minus className="h-4 w-4" />
            </button>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(Math.min(maxStock, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-12 border-x border-gray-200 text-center text-sm focus:outline-none"
            />
            <button
              onClick={() => setQty(Math.min(maxStock, qty + 1))}
              className="p-2 text-gray-600 hover:text-[#1A6B2F]"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-gray-500">Stok: {maxStock}</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            variant="outline"
            className="border-[#1A6B2F] text-[#1A6B2F] hover:bg-[#1A6B2F] hover:text-white"
            onClick={addToCart}
          >
            Tambah ke Keranjang
          </Button>
          <Button
            className="bg-[#1A6B2F] hover:bg-[#145224]"
            onClick={buyNow}
          >
            Beli Sekarang
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <Truck className="h-5 w-5 text-[#BA7517]" />
          <span>Pengiriman ke seluruh Indonesia</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <ShieldCheck className="h-5 w-5 text-[#BA7517]" />
          <span>Produk Terverifikasi & Garansi Resmi</span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Penjual
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#1A6B2F]/10 flex items-center justify-center text-[#1A6B2F] font-bold">
            {product.storeName.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{product.storeName}</div>
            <div className="text-xs text-gray-500">{product.storeType}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
