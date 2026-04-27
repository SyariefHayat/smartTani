"use client";

import React from "react";
import { ARTICLE_STATS_BAR } from "@/constants/article";
import {
  FileText,
  Users,
  TrendingUp,
  RefreshCcw,
  ShieldCheck
} from "lucide-react";

const ICONS = [FileText, Users, TrendingUp, RefreshCcw, ShieldCheck];

const ArticleStatsBarSection = () => {
  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="rounded-3xl bg-white p-8 md:p-12 shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-50">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
            {ARTICLE_STATS_BAR.map((item, index) => {
              const Icon = ICONS[index] || Users;
              return (
                <div
                  key={item.label || item.sublabel}
                  className="flex flex-col items-center text-center lg:items-start lg:text-left gap-4"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary shadow-sm border border-primary/10">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xl font-extrabold text-[#17391f] leading-none mb-2">
                      {item.value}
                    </p>
                    <p className="text-[10px] font-extrabold text-[#5d7a64] uppercase tracking-widest leading-tight">
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

export default ArticleStatsBarSection;
