"use client";

import { Building2, Wallet, Users, TrendingUp, PieChart, Star } from "lucide-react";
import { INVESTMENT_STATS_BAR } from "@/constants/investments";
import { Separator } from "@/components/ui/separator";
import { StatItem } from "@/components/sections/home/StatItem";

export default function InvestmentStatsBarSection() {
  const icons = [Building2, Wallet, Users, TrendingUp, PieChart, Star];
  const total = INVESTMENT_STATS_BAR.length;

  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-3 md:grid-cols-6 py-8 md:px-4 lg:px-0 gap-y-8 md:gap-y-0 items-start">
            {INVESTMENT_STATS_BAR.map((item, index) => {
              const Icon = icons[index] || Building2;
              const isLastInMobileRow = index === 2;
              const isLastOverall = index === total - 1;

              return (
                <div
                  key={item.label}
                  className="relative flex flex-col items-center px-4"
                >
                  <StatItem icon={Icon} value={item.value} label={item.label} />

                  {!isLastOverall && (
                    <Separator
                      orientation="vertical"
                      className={[
                        "absolute -right-px h-full top-0 bg-slate-200",
                        isLastInMobileRow ? "hidden" : "block",
                        "md:hidden lg:block",
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
}

