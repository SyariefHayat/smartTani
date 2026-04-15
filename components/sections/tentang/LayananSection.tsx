import React from "react";
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
  ShoppingCart,
  TrendingUp,
  Store,
  Truck,
  GraduationCap,
  FileText,
];

const LayananSection = () => {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-smarttani">
        <div className="text-center mb-16">
          <h2 className="section-title text-primary">
            {ABOUT_LAYANAN.heading}
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            {ABOUT_LAYANAN.subtext}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ABOUT_LAYANAN.items.map((item, index) => {
            const Icon = LAYANAN_ICONS[index] || ShoppingCart;
            return (
              <div
                key={item.title}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary/20 transition-all group flex flex-col items-center text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LayananSection;
