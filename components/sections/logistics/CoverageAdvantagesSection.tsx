"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LOGISTICS_COVERAGE,
  LOGISTICS_ADVANTAGES,
  LOGISTICS_CHECK_SHIPPING_COST
} from "@/constants/logistics";
import {
  CheckCircle2,
  Search,
  Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CoverageAdvantagesSection = () => {
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculateOngkir = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!isNaN(w) && w > 0) {
      setResult(w * 1500 + 5000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="section-padding bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Column 1: Jangkauan Luas */}
          <div className="bg-[#EAF3DE]/40 rounded-[32px] p-8 border border-[#EAF3DE] flex flex-col items-center text-center">
            <h3 className="text-xl font-extrabold text-[#17391f] md:text-2xl mb-2">
              {LOGISTICS_COVERAGE.heading}
            </h3>
            <p className="text-sm font-medium text-[#5d7a64] mb-6 px-4">
              {LOGISTICS_COVERAGE.subtext}
            </p>

            <div className="relative w-full aspect-[2/1] mb-8 border border-slate-200 rounded-2xl overflow-hidden bg-white/50 shadow-sm">
              <Image
                src={LOGISTICS_COVERAGE.image}
                alt="Map"
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="mt-auto w-full grid grid-cols-3 pt-6 border-t border-[#d4edda]">
              {LOGISTICS_COVERAGE.stats.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center ${index < 2 ? 'border-r border-[#d4edda]' : ''}`}>
                  <span className="text-lg font-extrabold text-primary md:text-xl">{stat.value}</span>
                  <span className="text-[10px] font-bold text-[#5d7a64] uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Keunggulan */}
          <div className="bg-[#EAF3DE]/40 rounded-[32px] p-8 border border-[#EAF3DE] flex flex-col">
            <h3 className="text-xl font-extrabold text-[#17391f] md:text-2xl mb-8 text-center">
              {LOGISTICS_ADVANTAGES.heading}
            </h3>

            <div className="space-y-5 mb-8 flex-1">
              {LOGISTICS_ADVANTAGES.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-bold text-[#17391f] leading-tight">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto bg-[#EAF3DE] rounded-2xl p-5 text-center border border-primary/10">
              <p className="text-xs font-bold text-primary leading-relaxed italic">
                {LOGISTICS_ADVANTAGES.tagline}
              </p>
            </div>
          </div>

          {/* Column 3: Cek Ongkir */}
          <div className="bg-[#EAF3DE]/40 rounded-[32px] p-8 border border-[#EAF3DE] flex flex-col">
            <h3 className="text-xl font-extrabold text-[#17391f] md:text-2xl mb-2">
              {LOGISTICS_CHECK_SHIPPING_COST.heading}
            </h3>
            <p className="text-sm font-medium text-[#5d7a64] mb-8">
              {LOGISTICS_CHECK_SHIPPING_COST.subtext}
            </p>

            <form className="space-y-4" onSubmit={calculateOngkir}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#17391f]">Dari</Label>
                  <Select>
                    <SelectTrigger className="h-11 bg-white border-slate-200 text-xs font-bold rounded-xl focus:ring-primary/20">
                      <SelectValue placeholder="Asal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                      <SelectItem value="bandung">Bandung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#17391f]">Ke</Label>
                  <Select>
                    <SelectTrigger className="h-11 bg-white border-slate-200 text-xs font-bold rounded-xl focus:ring-primary/20">
                      <SelectValue placeholder="Tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                      <SelectItem value="bandung">Bandung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#17391f]">Jenis Barang</Label>
                  <Select>
                    <SelectTrigger className="h-11 bg-white border-slate-200 text-xs font-bold rounded-xl focus:ring-primary/20">
                      <SelectValue placeholder="Jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hasil-panen">Hasil Panen</SelectItem>
                      <SelectItem value="pupuk">Pupuk / Benih</SelectItem>
                      <SelectItem value="alat">Alat Mesin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#17391f]">Berat (kg)</Label>
                  <Input
                    placeholder="100"
                    className="h-11 bg-white border-slate-200 text-xs font-bold rounded-xl focus:ring-primary/20 placeholder:font-medium"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-dark !text-white font-bold mt-4 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20 rounded-xl transition-all active:scale-95">
                <Search className="size-4" />
                {LOGISTICS_CHECK_SHIPPING_COST.cta}
              </Button>
            </form>

            {result !== null && (
              <div className="mt-6 p-4 rounded-2xl bg-white border border-[#d4edda] animate-in fade-in zoom-in-95 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="size-3.5 text-primary" />
                  <span className="text-[10px] font-bold text-[#5d7a64] uppercase tracking-wider">Estimasi Biaya</span>
                </div>
                <p className="text-2xl font-black text-primary leading-none">{formatPrice(result)}</p>
                <p className="text-[9px] text-slate-400 mt-2 italic font-medium">*Harga dapat berubah sewaktu-waktu</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CoverageAdvantagesSection;
