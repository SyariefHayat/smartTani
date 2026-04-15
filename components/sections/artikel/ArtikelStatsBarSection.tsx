"use client";

import React from "react";
import { ARTIKEL_STATS_BAR } from "@/constants/article";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  RefreshCcw, 
  ShieldCheck 
} from "lucide-react";

const ICONS = [FileText, Users, TrendingUp, RefreshCcw, ShieldCheck];

const ArtikelStatsBarSection = () => {
  return (
    <section className="bg-[#f8fafc] py-10">
      <div className="container-smarttani px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {ARTIKEL_STATS_BAR.map((item, index) => {
            const Icon = ICONS[index] || Users;
            return (
              <div
                key={item.label || item.sublabel}
                className="flex items-center gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#2d7a3a] shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-black text-[#1e3a1f] leading-none mb-1">
                    {item.value}
                  </p>
                  <p className="text-[10px] font-bold text-[#64748b] leading-tight uppercase tracking-wider">
                    {item.label || item.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArtikelStatsBarSection;
