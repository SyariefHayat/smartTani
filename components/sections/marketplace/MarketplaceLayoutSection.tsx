"use client";

import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import SidebarFilter from './SidebarFilter';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface MarketplaceLayoutSectionProps {
  children: React.ReactNode;
}

const MarketplaceLayoutSection: React.FC<MarketplaceLayoutSectionProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="bg-neutral-50/50 min-h-screen">
      <div className="container-smarttani py-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 flex justify-between items-center">
          <h2 className="text-heading-3 font-bold text-neutral-900">Semua Produk</h2>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 border-primary text-primary hover:bg-primary/5">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] p-0 border-t-2 border-primary rounded-t-3xl overflow-hidden">
              <SheetHeader className="p-5 border-b sticky top-0 bg-white z-10">
                <SheetTitle className="text-left flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  Filter Produk
                </SheetTitle>
              </SheetHeader>
              <div className="p-0 h-full pb-20">
                <SidebarFilter 
                  className="border-none shadow-none rounded-none h-full" 
                  onClose={() => setIsOpen(false)} 
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar">
              <SidebarFilter />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="space-y-6">
            <div className="hidden lg:flex justify-between items-center mb-2">
              <h2 className="text-heading-3 font-bold text-neutral-900">Semua Produk</h2>
              <div className="text-body-sm text-muted-foreground">
                Menampilkan <span className="font-semibold text-neutral-900">2.450</span> produk
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceLayoutSection;
