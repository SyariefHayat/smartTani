import React from "react";
import Link from "next/link";
import { ABOUT_SERVICES } from "@/constants/about";
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

const LAYANAN_HREFS = [
  "/marketplace",
  "/investments",
  "/distributors",
  "/logistics",
  "/academy",
  "/articles",
];

const ServicesSection = () => {
  return (
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl mb-4">
            {ABOUT_SERVICES.heading}
          </h2>
          <p className="text-sm md:text-base font-medium text-[#5d7a64] max-w-2xl mx-auto">
            {ABOUT_SERVICES.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {ABOUT_SERVICES.items.map((item, index) => {
            const IconConfig = LAYANAN_ICONS[index] || { icon: ShoppingCart, color: "text-primary", bg: "bg-primary/5" };
            const Icon = IconConfig.icon;
            const href = LAYANAN_HREFS[index] || "/";
            return (
              <Link
                key={item.title}
                href={href}
                className="bg-slate-50 p-6 rounded-2xl flex flex-col items-center text-center group hover:bg-white hover:shadow-xl hover:-translate-y-1 border border-transparent hover:border-slate-100 transition-all duration-300 h-full cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-xl ${IconConfig.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${IconConfig.color}`} />
                </div>
                <h3 className="text-sm font-extrabold text-[#17391f] mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs font-medium text-[#5d7a64] leading-relaxed">
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

export default ServicesSection;
