import React from "react";
import Link from "next/link";
import { ABOUT_LAYANAN } from "@/constants/about";
import {
  ShoppingCart,
  TrendingUp,
  Store,
  Truck,
  GraduationCap,
  FileText,
} from "lucide-react";

const LAYANAN_ICONS = [
  { icon: ShoppingCart, color: "text-green-600", bg: "bg-green-50" },
  { icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-50" },
  { icon: Store, color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Truck, color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: GraduationCap, color: "text-purple-600", bg: "bg-purple-50" },
  { icon: FileText, color: "text-orange-600", bg: "bg-orange-50" },
];

const LayananSection = () => {
  const getHref = (title: string) => {
    if (title.includes("Marketplace")) return "/marketplace";
    if (title.includes("Investasi")) return "/investasi";
    if (title.includes("Distributor")) return "/distributor";
    if (title.includes("Logistik")) return "/logistik";
    if (title.includes("SiTani Academy")) return "/sitani-academy";
    if (title.includes("Artikel")) return "/artikel";
    return "/";
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="text-center mb-12">
          <h2 className="section-title text-foreground">
            {ABOUT_LAYANAN.heading}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {ABOUT_LAYANAN.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {ABOUT_LAYANAN.items.map((item, index) => {
            const IconConfig = LAYANAN_ICONS[index] || { icon: ShoppingCart, color: "text-primary", bg: "bg-primary/5" };
            const Icon = IconConfig.icon;
            return (
              <Link
                key={item.title}
                href={getHref(item.title)}
                className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-white hover:shadow-md border border-transparent hover:border-slate-100 transition-all duration-300 h-full cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl ${IconConfig.bg} flex items-center justify-center mb-5`}>
                  <Icon className={`w-7 h-7 ${IconConfig.color}`} />
                </div>
                <h3 className="text-body-sm font-bold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-caption text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LayananSection;
