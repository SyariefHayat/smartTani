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
  Package, 
  Weight 
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
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          
          {/* Column 1: Jangkauan (Map & Stats) */}
          <div className="lg:col-span-5 xl:col-span-5">
            <h2 className="mb-4 text-2xl font-bold text-[#17391f] sm:text-3xl">
              {LOGISTIC_KEUNGGULAN.jangkauan.heading}
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-[#5d7a64] sm:text-base">
              {LOGISTIC_KEUNGGULAN.jangkauan.subtext}
            </p>

            <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 p-4">
              <Image
                src={LOGISTIC_KEUNGGULAN.jangkauan.image}
                alt="Peta Jangkauan Smarttani"
                fill
                className="object-contain p-2"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {LOGISTIC_KEUNGGULAN.jangkauan.stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-xl font-extrabold text-primary sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-[#5d7a64] sm:text-xs">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Keunggulan (Checklist) */}
          <div className="lg:col-span-3 xl:col-span-3">
            <h2 className="mb-4 text-2xl font-bold text-[#17391f] sm:text-3xl">
              {LOGISTIC_KEUNGGULAN.keunggulan.heading}
            </h2>
            <p className="mb-8 text-sm font-medium text-primary">
              {LOGISTIC_KEUNGGULAN.keunggulan.tagline}
            </p>

            <div className="space-y-4">
              {LOGISTIC_KEUNGGULAN.keunggulan.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 rounded-full bg-primary/10 p-1 text-primary">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <p className="text-sm font-medium text-[#17391f] sm:text-base">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Cek Ongkir (Form) */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="rounded-3xl bg-[#f8faf9] p-6 border border-slate-100 shadow-sm sm:p-8">
              <h2 className="mb-2 text-xl font-bold text-[#17391f] sm:text-2xl">
                {LOGISTIC_CEK_ONGKIR.heading}
              </h2>
              <p className="mb-8 text-sm text-[#5d7a64]">
                {LOGISTIC_CEK_ONGKIR.subtext}
              </p>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                {/* Dari */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#17391f]">
                    {LOGISTIC_CEK_ONGKIR.fields.dari.label}
                  </Label>
                  <Select>
                    <SelectTrigger className="h-11 border-slate-200 bg-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-slate-400" />
                        <SelectValue placeholder={LOGISTIC_CEK_ONGKIR.fields.dari.placeholder} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                      <SelectItem value="medan">Medan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ke */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-[#17391f]">
                    {LOGISTIC_CEK_ONGKIR.fields.ke.label}
                  </Label>
                  <Select>
                    <SelectTrigger className="h-11 border-slate-200 bg-white">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-slate-400" />
                        <SelectValue placeholder={LOGISTIC_CEK_ONGKIR.fields.ke.placeholder} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                      <SelectItem value="medan">Medan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Jenis Barang & Berat */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#17391f]">
                      Barang
                    </Label>
                    <Select>
                      <SelectTrigger className="h-11 border-slate-200 bg-white px-3">
                        <SelectValue placeholder="Jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hasil-panen">Hasil Panen</SelectItem>
                        <SelectItem value="pupuk">Pupuk</SelectItem>
                        <SelectItem value="alat">Alat Tani</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-[#17391f]">
                      Berat
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0"
                        className="h-11 border-slate-200 bg-white pr-10"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">
                        KG
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="w-full h-12 bg-primary text-white font-bold hover:bg-primary/90 transition-colors">
                  {LOGISTIC_CEK_ONGKIR.cta}
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default JangkauanKeunggulanOngkirSection;
