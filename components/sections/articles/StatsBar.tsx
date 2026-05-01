"use client";

import React from "react";
import { ARTICLE_STATS_BAR } from "@/constants/article";
import { StatItem } from "../home/StatItem";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Users,
  TrendingUp,
  RefreshCcw,
  ShieldCheck
} from "lucide-react";

const ICONS = [FileText, Users, TrendingUp, RefreshCcw, ShieldCheck];

const StatsBar = () => {
  const total = ARTICLE_STATS_BAR.length;

  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-2 md:grid-cols-6 py-8 md:px-4 lg:px-0 gap-y-8 md:gap-y-0 items-start">
            {ARTICLE_STATS_BAR.map((item, index) => {
              const Icon = ICONS[index] || Users;
              const isLastInRowMobile = index % 2 === 1; // Untuk grid-cols-2
              const isLastOverall = index === total - 1;

              return (
                <div
                  key={item.label || item.sublabel}
                  className="relative flex flex-col items-center px-4"
                >
                  <StatItem
                    icon={Icon}
                    value={item.value}
                    label={item.label || item.sublabel || ""}
                  />

                  {!isLastOverall && (
                    <Separator
                      orientation="vertical"
                      className={[
                        "absolute -right-px h-full top-0 bg-slate-200",
                        isLastInRowMobile ? "hidden" : "block",
                        "md:block",
                      ].join(" ")}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
