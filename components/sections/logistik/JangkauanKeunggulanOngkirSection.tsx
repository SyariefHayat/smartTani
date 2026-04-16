"use client";

import React from "react";
import Image from "next/image";
import { 
  LOGISTIC_KEUNGGULAN, 
  LOGISTIC_CEK_ONGKIR 
} from "@/constants/logistic";
import { 
  CheckCircle2, 
  MapPin, 
  ChevronRight,
  Search
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

const JangkauanKeunggulanOngkirSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Jangkauan Luas */}
          <div className="bg-[#f8faf9] rounded-2xl p-6 border border-slate-100 flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-[#17391f] mb-3">
              {LOGISTIC_KEUNGGULAN.jangkauan.heading}
            </h3>
            <p className="text-sm text-[#5d7a64] leading-relaxed mb-6 px-4">
              {LOGISTIC_KEUNGGULAN.jangkauan.subtext}
            </p>

            <div className="relative w-full aspect-[2/1] mb-8">
              <Image
                src={LOGISTIC_KEUNGGULAN.jangkauan.image}
                alt="Map"
                fill
                className="object-contain"
              />
            </div>

            <div className="mt-auto w-full grid grid-cols-3 pt-6 border-t border-slate-200">
              {LOGISTIC_KEUNGGULAN.jangkauan.stats.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center ${index < 2 ? 'border-r border-slate-200' : ''}`}>
                  <span className="text-xl font-bold text-[#2e5e3a]">{stat.value}</span>
                  <span className="text-[10px] font-bold text-[#5d7a64]">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Keunggulan Smarttani Logistik */}
          <div className="bg-[#f8faf9] rounded-2xl p-6 border border-slate-100 flex flex-col">
            <h3 className="text-xl font-bold text-[#17391f] mb-8 text-center">
              {LOGISTIC_KEUNGGULAN.keunggulan.heading}
            </h3>

            <div className="space-y-4 mb-8">
              {LOGISTIC_KEUNGGULAN.keunggulan.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-[#2e5e3a] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-[#17391f]">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto bg-[#eff4f0] rounded-xl p-4 text-center">
              <p className="text-xs font-bold text-[#17391f] leading-relaxed">
                {LOGISTIC_KEUNGGULAN.keunggulan.tagline}
              </p>
            </div>
          </div>

          {/* Column 3: Cek Ongkir Instan */}
          <div className="bg-[#f8faf9] rounded-2xl p-6 border border-slate-100 flex flex-col">
            <h3 className="text-xl font-bold text-[#17391f] mb-2">
              {LOGISTIC_CEK_ONGKIR.heading}
            </h3>
            <p className="text-sm text-[#5d7a64] mb-8">
              {LOGISTIC_CEK_ONGKIR.subtext}
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#17391f]">Dari</Label>
                  <Select>
                    <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                      <SelectValue placeholder="Pilih Kota Asal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#17391f]">Ke</Label>
                  <Select>
                    <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                      <SelectValue placeholder="Pilih Kota Tujuan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#17391f]">Jenis Barang</Label>
                  <Select>
                    <SelectTrigger className="h-10 bg-white border-slate-200 text-xs">
                      <SelectValue placeholder="Pilih Jenis Barang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hasil-panen">Hasil Panen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#17391f]">Berat (kg)</Label>
                  <Input 
                    placeholder="Contoh: 100" 
                    className="h-10 bg-white border-slate-200 text-xs"
                  />
                </div>
              </div>

              <Button className="w-full h-12 bg-[#17391f] hover:bg-[#1a4425] text-white font-bold mt-4 flex items-center justify-center gap-2">
                <Search className="size-4" />
                {LOGISTIC_CEK_ONGKIR.cta}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JangkauanKeunggulanOngkirSection;
