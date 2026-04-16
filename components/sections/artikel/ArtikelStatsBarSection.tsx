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
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="rounded-2xl bg-slate-50 p-6 md:p-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {ARTIKEL_STATS_BAR.map((item, index) => {
              const Icon = ICONS[index] || Users;
              return (
                <div
                  key={item.label || item.sublabel}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-body font-bold text-foreground leading-none mb-1">
                      {item.value}
                    </p>
                    <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">
                      {item.label || item.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtikelStatsBarSection;
