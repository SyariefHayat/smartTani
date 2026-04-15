"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { MARKETPLACE_TABS, MARKETPLACE_PRODUK } from "@/constants/marketplace";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const ProductTabsSection = () => {
  const [activeTab, setActiveTab] = useState(MARKETPLACE_TABS[0]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle tab change with loading simulation
  const handleTabChange = (value: string) => {
    setIsLoading(true);
    setActiveTab(value);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  const currentProducts = MARKETPLACE_PRODUK[activeTab] || [];

  return (
    <section className="py-10 bg-white">
      <div className="container-smarttani">
        {/* Section Heading */}
        <h2 className="text-[22px] font-bold text-[#17391f] mb-6">
          Produk Pilihan untuk Anda
        </h2>

        <Tabs
          defaultValue={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          {/* Tabs Navigation and "Lihat Semua" Link */}
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="overflow-x-auto pb-px scrollbar-hide">
              <TabsList className="bg-transparent h-auto p-0 gap-2 md:gap-3 flex">
                {MARKETPLACE_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="
                      px-5 py-2 text-[14px] font-bold rounded-lg transition-all
                      data-active:bg-primary data-active:text-white
                      bg-[#f3f4f6] text-[#17391f] hover:bg-neutral-200
                    "
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <Link
              href="/marketplace/products"
              className="group flex items-center gap-0.5 text-[14px] font-bold text-primary hover:text-primary-dark transition-colors shrink-0"
            >
              Lihat Semua
              <ChevronRight className="size-4" />
            </Link>
          </div>

          {/* Grid Content */}
          {MARKETPLACE_TABS.map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0 focus-visible:outline-none">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
    </section>
  );
};

// Skeleton component for loading state
const ProductCardSkeleton = () => (
  <div className="flex flex-col h-full bg-white rounded-lg border border-neutral-200 overflow-hidden">
    <Skeleton className="aspect-square w-full bg-[#f3f4f6]" />
    <div className="flex flex-col flex-1 p-3 space-y-3">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  </div>
);

export default ProductTabsSection;
