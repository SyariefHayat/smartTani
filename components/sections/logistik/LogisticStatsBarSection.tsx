"use client";

import React from "react";
import { LOGISTIC_STATS_BAR } from "@/constants/logistic";
import { StatItem } from "../beranda/StatItem";
import { Separator } from "@/components/ui/separator";
import {
  Truck,
  Package,
  Warehouse,
  Timer,
  Users,
  Map
} from "lucide-react";

const ICONS = [Truck, Package, Warehouse, Timer, Users, Map];

const LogisticStatsBarSection = () => {
  return (
    <section className="relative z-20 px-5 sm:px-8 md:px-10 lg:px-12 -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] md:p-10">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-y-0">
          {LOGISTIC_STATS_BAR.map((item, index) => {
            const Icon = ICONS[index] || Package;
            return (
              <div
                key={item.label}
                className="relative flex items-center justify-center"
              >
                <StatItem
                  icon={Icon}
                  value={item.value}
                  label={item.label}
                />

                {index < LOGISTIC_STATS_BAR.length - 1 && (
                  <Separator
                    orientation="vertical"
                    className="absolute -right-px hidden h-full self-center lg:block bg-slate-200"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LogisticStatsBarSection;
