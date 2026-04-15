"use client";

import React from "react";
import SidebarFilter from "./SidebarFilter";

interface MarketplaceLayoutSectionProps {
  children: React.ReactNode;
}

const MarketplaceLayoutSection: React.FC<MarketplaceLayoutSectionProps> = ({
  children,
}) => {
  return (
    <section className="min-h-screen">
      <div className="container-smarttani py-5 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] gap-6 lg:gap-8">
          {/* Desktop Sidebar — hanya muncul di lg ke atas */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 custom-scrollbar">
              <SidebarFilter />
            </div>
          </aside>

          {/* Konten utama */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceLayoutSection;
