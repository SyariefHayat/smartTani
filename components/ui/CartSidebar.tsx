"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CartSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const router = useRouter();

  const loadCart = () => {
    try {
      const stored = localStorage.getItem("smarttani-cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setCartItems(parsed);
          return;
        }
      }
    } catch (e) {
      console.error("Error loading cart", e);
    }
    setCartItems([]);
  };

  useEffect(() => {
    loadCart();

    const handleToggle = () => setIsOpen((prev) => !prev);
    const handleStorage = () => loadCart();

    window.addEventListener("toggle-cart", handleToggle);
    window.addEventListener("storage", handleStorage);
    // Custom event for same-tab updates
    window.addEventListener("smarttani-cart-update", handleStorage);

    return () => {
      window.removeEventListener("toggle-cart", handleToggle);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("smarttani-cart-update", handleStorage);
    };
  }, []);

  const updateQty = (id: string, delta: number) => {
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("smarttani-cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("smarttani-cart-update"));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("smarttani-cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("smarttani-cart-update"));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * (item.qty || 1),
    0
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 z-[70] h-full w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900">
                Keranjang Belanja
              </h2>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                {cartItems.length}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 rounded-full bg-gray-50 p-6">
                  <ShoppingCart className="h-12 w-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">
                  Keranjang Anda kosong
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Sepertinya Anda belum menambahkan produk apapun ke keranjang.
                </p>
                <Button
                  className="mt-8 rounded-full bg-primary px-8 hover:bg-primary/90"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/marketplace");
                  }}
                >
                  Mulai Belanja
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border bg-gray-50">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="line-clamp-2 text-sm font-bold text-gray-900">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {item.seller}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="p-1 hover:text-primary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="p-1 hover:text-primary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t bg-gray-50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Total Pembayaran
                </span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <div className="grid gap-3">
                <Button
                  className="w-full bg-primary py-6 text-base font-bold shadow-lg shadow-green-100"
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/marketplace");
                  }}
                >
                  Lanjut ke Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-gray-200 py-6"
                  onClick={() => setIsOpen(false)}
                >
                  Lanjut Belanja
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
