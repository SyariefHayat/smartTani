"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MARKETPLACE_TABS, MARKETPLACE_PRODUK } from "@/constants/marketplace";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const ProductTabsSection = () => {
  const [activeTab, setActiveTab] = useState(MARKETPLACE_TABS[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    setTimeout(() => setIsLoading(false), 400);
  };

  const currentProducts = MARKETPLACE_PRODUK[activeTab] || [];

  return (
    <div>
      <h2 className="text-lg md:text-xl font-bold text-[#17391f] mb-4 md:mb-6">
        Produk Pilihan untuk Anda
      </h2>

      <Tabs
        defaultValue={activeTab}
        onValueChange={handleTabChange}
        className="w-full"
      >
        {/* Header: tabs + lihat semua */}
        <div className="flex items-center justify-between gap-2 mb-4 md:mb-6">
          {/* Scrollable tabs wrapper */}
          <div className="flex-1 min-w-0 overflow-hidden">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 md:gap-3 lg:gap-4">
              {isLoading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <ProductCardSkeleton key={idx} />
                  ))
                : currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

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

export default ProductTabsSection;
