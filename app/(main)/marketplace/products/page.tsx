"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronRight, Home, Search, ArrowLeft, SlidersHorizontal } from "lucide-react";
import { ALL_PRODUCTS } from "@/constants/marketplace";
import ProductCard from "@/components/sections/marketplace/ProductCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AllProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("terlaris");

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    switch (sortBy) {
      case "terbaru":
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case "harga-terendah":
        result.sort((a, b) => a.price - b.price);
        break;
      case "harga-tertinggi":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "terlaris":
      default:
        // Mock terlaris based on rating and id
        result.sort((a, b) => b.rating * parseFloat(b.terjual) - a.rating * parseFloat(a.terjual));
        break;
    }

    return result;
  }, [searchQuery, sortBy]);

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Header & Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="container mx-auto px-4 py-8">
          <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="flex items-center gap-1 hover:text-primary">
              <Home className="size-3" />
              Beranda
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/marketplace" className="hover:text-primary">
              Marketplace
            </Link>
            <ChevronRight className="size-3" />
            <span className="font-medium text-gray-900">Semua Produk</span>
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Semua Produk</h1>
              <p className="text-gray-500 mt-1">
                Menampilkan {filteredAndSortedProducts.length} produk pilihan terbaik
              </p>
            </div>
            <Button asChild variant="outline" className="w-fit border-primary text-primary hover:bg-primary/5 rounded-xl font-bold">
              <Link href="/marketplace">
                <ArrowLeft className="mr-2 size-4" />
                Kembali ke Marketplace
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <section className="sticky top-[64px] z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Cari produk impian Anda..."
                className="pl-10 h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 shrink-0 text-sm font-bold text-gray-700">
                <SlidersHorizontal className="size-4" />
                Urutkan:
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 w-full md:w-[180px] bg-slate-50 border-slate-200 rounded-xl">
                  <SelectValue placeholder="Urutkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terlaris">Terlaris</SelectItem>
                  <SelectItem value="terbaru">Terbaru</SelectItem>
                  <SelectItem value="harga-terendah">Harga Terendah</SelectItem>
                  <SelectItem value="harga-tertinggi">Harga Tertinggi</SelectItem>
                  <SelectItem value="rating">Rating Tertinggi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 py-12">
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
            <div className="size-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <Search className="size-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Produk tidak ditemukan</h3>
            <p className="text-gray-500 mt-2 text-center max-w-sm">
              Maaf, kami tidak dapat menemukan produk yang sesuai dengan kata kunci &quot;{searchQuery}&quot;.
            </p>
            <Button 
              variant="outline" 
              className="mt-8 border-primary text-primary hover:bg-primary/5 rounded-xl font-bold"
              onClick={() => setSearchQuery("")}
            >
              Hapus Pencarian
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}
