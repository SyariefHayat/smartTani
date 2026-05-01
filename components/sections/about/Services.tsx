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
  ShoppingCart,
  TrendingUp,
  Store,
  Truck,
  GraduationCap,
  FileText,
];

const LAYANAN_HREFS = [
  "/marketplace",
  "/investments",
  "/distributors",
  "/logistics",
  "/academy",
  "/articles",
];

const Services = () => {
  return (
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl mb-4">
            {ABOUT_SERVICES.heading}
          </h2>
          <p className="text-sm md:text-base font-medium text-[#5d7a64] max-w-2xl mx-auto">
            {ABOUT_SERVICES.subtext}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {ABOUT_SERVICES.items.map((item, index) => {
            const Icon = LAYANAN_ICONS[index] || ShoppingCart;
            const href = LAYANAN_HREFS[index] || "/";
            return (
              <Link
                key={item.title}
                href={href}
                className="group bg-white p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer"
              >
                {/* Icon Container */}
                <div className="size-14 rounded-xl bg-[#d4edda] text-[#2D6A2D] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="size-7" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="flex flex-col items-center flex-1">
                  <h3 className="text-sm md:text-base font-extrabold text-[#17391f] mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs font-medium text-[#5d7a64] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
