"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronRight, SearchX } from "lucide-react";
import { MARKETPLACE_TABS, MARKETPLACE_PRODUK } from "@/constants/marketplace";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function ProductTabsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const kategori = searchParams.get("kategori") || "";
  const tabParam = searchParams.get("tab");

  const initialTab = tabParam && MARKETPLACE_TABS.includes(tabParam) ? tabParam : MARKETPLACE_TABS[0];
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tabParam && MARKETPLACE_TABS.includes(tabParam) && tabParam !== activeTab) {
      setActiveTab(tabParam);
    }
  }, [tabParam, activeTab]);

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    router.push(`/marketplace?${params.toString()}`, { scroll: false });

    setTimeout(() => setIsLoading(false), 400);
  };

  const resetFilter = () => {
    router.push('/marketplace');
  };

  let currentProducts = MARKETPLACE_PRODUK[activeTab] || [];

  if (q) {
    currentProducts = currentProducts.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));
  }

  if (kategori) {
    // Mock category filter by checking description or name since `category` field doesn't exist
    currentProducts = currentProducts.filter(p =>
      p.name.toLowerCase().includes(kategori.toLowerCase()) ||
      p.description.toLowerCase().includes(kategori.toLowerCase())
    );
  }

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-[#17391f] mb-4 md:mb-6">
        Produk Pilihan untuk Anda
      </h2>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Header: tabs + lihat semua */}
        <div className="flex items-center gap-2 mb-4 md:mb-6">
          {/* Scrollable tabs wrapper */}
          <div className="flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList className="bg-transparent h-auto p-0 flex gap-1.5 md:gap-2 w-max">
              {MARKETPLACE_TABS.map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="
                    px-3 py-1.5 md:px-4 md:py-2
                    text-[12px] md:text-[14px] font-bold rounded-lg
                    whitespace-nowrap transition-all
                    data-[state=active]:bg-primary data-[state=active]:text-white
                    bg-[#f3f4f6] text-[#17391f] hover:bg-neutral-200 cursor-pointer
                  "
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <Link
            href="/marketplace/products"
            className="group flex items-center gap-0.5 text-xs md:text-sm font-bold text-primary hover:text-primary-dark transition-colors shrink-0 ml-2"
          >
            <span className="hidden sm:inline">Lihat Semua</span>
            <span className="sm:hidden">Semua</span>
            <ChevronRight className="size-4" />
          </Link>
        </div>

        {/* Grid Content */}
        {MARKETPLACE_TABS.map((tab) => (
          <TabsContent
            key={tab}
            value={tab}
            className="mt-0 focus-visible:outline-none"
          >
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <ProductCardSkeleton key={idx} />
                ))}
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
                {currentProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <SearchX className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-bold text-gray-900">Tidak ada produk ditemukan</h3>
                <p className="text-sm text-gray-500 mt-1 mb-6 text-center max-w-md">
                  Coba ubah filter atau kata kunci pencarian Anda untuk menemukan produk yang sesuai.
                </p>
                <Button
                  onClick={resetFilter}
                  className="bg-primary hover:bg-primary-dark text-white rounded-full px-6"
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const ProductCardSkeleton = () => (
  <div className="flex flex-col h-full bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <Skeleton className="aspect-square w-full bg-[#f3f4f6]" />
    <div className="flex flex-col flex-1 p-2.5 md:p-3 space-y-2 md:space-y-3">
      <Skeleton className="h-4 md:h-5 w-full" />
      <Skeleton className="h-3 md:h-4 w-2/3" />
      <div className="space-y-1.5 md:space-y-2 pt-1 md:pt-2">
        <Skeleton className="h-5 md:h-6 w-1/2" />
        <Skeleton className="h-3 md:h-4 w-3/4" />
      </div>
    </div>
  </div>
);

export default function ProductTabsSection() {
  return (
    <Suspense fallback={<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
      {Array.from({ length: 6 }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>}>
      <ProductTabsContent />
    </Suspense>
  );
}
