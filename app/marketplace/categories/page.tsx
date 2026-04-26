import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { ChevronRight, Home, ArrowRight, MessageCircle } from "lucide-react";
import { MARKETPLACE_KATEGORI_SIDEBAR } from "@/constants/marketplace";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kategori Marketplace",
};

const emojiMap: Record<string, string> = {
  "Benih & Bibit": "🌱",
  "Pupuk & Nutrisi": "🌿",
  "Pestisida": "🧪",
  "Alat & Mesin": "🚜",
  "Irigasi": "💧",
  "Pakan Ternak": "🐄",
  "Hasil Panen": "🌾",
  "Lainnya": "📦",
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Hero Section */}
      <section className="bg-primary py-12 text-white">
        <div className="container mx-auto px-4">
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/80">
            <Link href="/" className="flex items-center gap-1 hover:text-white">
              <Home className="size-3" />
              Beranda
            </Link>
            <ChevronRight className="size-3" />
            <Link href="/marketplace" className="hover:text-white">
              Marketplace
            </Link>
            <ChevronRight className="size-3" />
            <span className="font-medium text-white">Kategori</span>
          </nav>
          <h1 className="text-3xl font-bold md:text-4xl">
            Semua Kategori Marketplace
          </h1>
          <p className="mt-2 text-white/80">
            Temukan berbagai kebutuhan pertanian Anda berdasarkan kategori.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MARKETPLACE_KATEGORI_SIDEBAR.map((cat) => (
            <Link
              key={cat.label}
              href={`/marketplace?kategori=${encodeURIComponent(cat.label)}`}
              className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 text-center transition-all hover:border-primary hover:shadow-md"
            >
              <div className="mb-4 text-4xl group-hover:scale-110 transition-transform">
                {emojiMap[cat.label] || "📦"}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                {cat.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {cat.count} Produk
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom Section */}
      <section className="container mx-auto px-4 mt-12">
        <div className="rounded-[2.5rem] bg-white p-8 md:p-12 text-center shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Tidak menemukan kategori yang Anda cari?
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Kami terus memperbarui daftar produk kami. Anda dapat menjelajahi semua produk atau menghubungi tim kami jika membutuhkan bantuan khusus.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild className="bg-primary hover:bg-primary-dark h-12 px-8 rounded-xl font-bold !text-white">
              <Link href="/marketplace">
                Lihat Semua Produk
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 px-8 rounded-xl font-bold border-primary text-primary hover:bg-primary/5">
              <Link href="/contact">
                <MessageCircle className="mr-2 size-4" />
                Hubungi Kami
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
