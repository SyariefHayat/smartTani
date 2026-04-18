"use client";

import Link from "next/link";
import { Leaf, Home, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-white px-4 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-black text-[#1A6B2F] opacity-10">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <Leaf className="h-20 w-20 text-[#1A6B2F] animate-bounce" />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
        Halaman Tidak Ditemukan
      </h2>
      <p className="mt-4 max-w-md text-gray-500">
        Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan. 
        Mari kembali ke jalur yang benar.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button asChild className="bg-[#1A6B2F] hover:bg-[#145224] px-8 py-6 rounded-full text-lg shadow-lg">
          <Link href="/">
            <Home className="mr-2 h-5 w-5" />
            Kembali ke Beranda
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-[#1A6B2F] text-[#1A6B2F] hover:bg-[#1A6B2F]/5 px-8 py-6 rounded-full text-lg">
          <Link href="/kontak">
            <MessageCircle className="mr-2 h-5 w-5" />
            Hubungi Kami
          </Link>
        </Button>
      </div>

      <button 
        onClick={() => window.history.back()}
        className="mt-8 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-[#1A6B2F] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali ke halaman sebelumnya
      </button>
    </div>
  );
}
