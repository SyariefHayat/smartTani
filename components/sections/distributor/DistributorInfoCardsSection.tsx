"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Check,
  TrendingUp,
  ClipboardCheck,
  GraduationCap,
  Truck,
} from "lucide-react";
import {
  DISTRIBUTOR_SYARAT,
  DISTRIBUTOR_STEPS,
  DISTRIBUTOR_MAP,
} from "@/constants/distributor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const STEP_ICONS = [TrendingUp, ClipboardCheck, GraduationCap, Truck];

const DistributorInfoCardsSection = () => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    if (search.trim()) {
      alert(`Mencari distributor di ${search}...`);
    }
  };

  return (
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Card 1: Syarat Menjadi Distributor */}
          <div className="flex flex-col rounded-2xl bg-[#EAF3DE]/60 p-8 border border-[#EAF3DE] transition-all hover:shadow-md">
            <h3 className="text-lg font-extrabold text-[#17391f] md:text-xl mb-1">
              {DISTRIBUTOR_SYARAT.heading}
            </h3>
            <p className="mb-8 text-xs font-medium text-[#5d7a64] md:text-sm">
              {DISTRIBUTOR_SYARAT.subtext}
            </p>

            <div className="space-y-5 flex-1">
              {DISTRIBUTOR_SYARAT.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="size-3.5" strokeWidth={4} />
                  </div>
                  <p className="text-sm font-bold text-[#17391f] leading-tight">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-[#EAF3DE] p-5 text-center border border-primary/10">
              <p className="text-xs font-bold text-primary leading-relaxed italic">
                {DISTRIBUTOR_SYARAT.note}
              </p>
            </div>
          </div>

          {/* Card 2: Bagaimana Cara Bergabung? */}
          <div className="flex flex-col rounded-2xl bg-[#EAF3DE]/60 p-8 border border-[#FAEEDA] transition-all hover:shadow-md">
            <h3 className="text-lg font-extrabold text-[#17391f] md:text-xl mb-1">
              {DISTRIBUTOR_STEPS.heading}
            </h3>
            <p className="mb-10 text-xs font-medium text-[#5d7a64] md:text-sm">
              {DISTRIBUTOR_STEPS.subtext}
            </p>

            <div className="grid grid-cols-2 gap-6 relative">
              {DISTRIBUTOR_STEPS.items.map((item, index) => {
                const Icon = STEP_ICONS[index] || TrendingUp;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-start relative group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex size-12 items-center justify-center rounded-xl shadow-sm bg-[#d4edda] text-[#2D6A2D]">
                        <Icon className="size-7" />
                      </div>
                    </div>

                    <h4 className="mb-1 text-sm font-bold text-[#17391f] leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-[10px] font-medium text-[#5d7a64]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Lokasi Distributor */}
          <div className="flex flex-col rounded-2xl bg-[#EAF3DE]/60 p-8 border border-[#E6F1FB] transition-all hover:shadow-md">
            <h3 className="text-lg font-extrabold text-[#17391f] md:text-xl mb-1">
              Lokasi Distributor
            </h3>
            <p className="mb-6 text-xs font-medium text-[#5d7a64] md:text-sm">
              Jaringan kami tersebar di seluruh Indonesia.
            </p>

            <div className="relative flex-1 min-h-[200px] rounded-2xl overflow-hidden mb-8">
              <Image
                src={DISTRIBUTOR_MAP.image}
                alt="Peta Distributor Smarttani"
                fill
                className="object-cover transition-transform duration-500"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-[#17391f]">
                Cari Distributor Terdekat
              </h4>
              <form
                onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                className="flex gap-2"
              >
                <div className="relative flex-1">
                  <Input
                    placeholder="Masukkan kota..."
                    className="h-12 bg-white border-slate-200 text-xs font-medium pl-4 rounded-xl focus:ring-primary/20"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-6 bg-primary hover:bg-primary-dark font-bold !text-white rounded-xl cursor-pointer shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  Cari
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributorInfoCardsSection;
