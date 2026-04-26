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
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Column 1: Jangkauan Luas */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col items-center text-center">
            <h3 className="text-heading-3 text-foreground mb-3">
              {LOGISTICS_COVERAGE.heading}
            </h3>
            <p className="text-body-sm text-muted-foreground mb-6 px-4">
              {LOGISTICS_COVERAGE.subtext}
            </p>

            <div className="relative w-full aspect-[2/1] mb-8">
              <Image
                src={LOGISTICS_COVERAGE.image}
                alt="Map"
                fill
                className="object-contain"
              />
            </div>

            <div className="mt-auto w-full grid grid-cols-3 pt-6 border-t border-slate-200">
              {LOGISTICS_COVERAGE.stats.map((stat, index) => (
                <div key={index} className={`flex flex-col items-center ${index < 2 ? 'border-r border-slate-200' : ''}`}>
                  <span className="text-heading-3 font-bold text-primary">{stat.value}</span>
                  <span className="text-caption font-bold text-muted-foreground">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Keunggulan */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col">
            <h3 className="text-heading-3 text-foreground mb-8 text-center">
              {LOGISTICS_ADVANTAGES.heading}
            </h3>

            <div className="space-y-4 mb-8">
              {LOGISTICS_ADVANTAGES.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-body-sm font-medium text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto bg-primary-light rounded-xl p-4 text-center">
              <p className="text-caption font-bold text-foreground leading-relaxed">
                {LOGISTICS_ADVANTAGES.tagline}
              </p>
            </div>
          </div>

          {/* Column 3: Cek Ongkir */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col">
            <h3 className="text-heading-3 text-foreground mb-2">
              {LOGISTICS_CHECK_SHIPPING_COST.heading}
            </h3>
            <p className="text-body-sm text-muted-foreground mb-8">
              {LOGISTICS_CHECK_SHIPPING_COST.subtext}
            </p>

            <form className="space-y-4" onSubmit={calculateOngkir}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-caption font-bold text-foreground">Dari</Label>
                  <Select>
                    <SelectTrigger className="h-10 bg-white border-slate-200 text-caption">
                      <SelectValue placeholder="Pilih Kota Asal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jakarta">Jakarta</SelectItem>
                      <SelectItem value="surabaya">Surabaya</SelectItem>
                      <SelectItem value="bandung">Bandung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-caption font-bold text-foreground">Ke</Label>
                  <Select>
                    <SelectTrigger className="h-10 bg-white border-slate-200 text-caption">
                      <SelectValue placeholder="Pilih Kota Tujuan" />
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
                  <Label className="text-caption font-bold text-foreground">Jenis Barang</Label>
                  <Select>
                    <SelectTrigger className="h-10 bg-white border-slate-200 text-caption">
                      <SelectValue placeholder="Pilih Jenis Barang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hasil-panen">Hasil Panen</SelectItem>
                      <SelectItem value="pupuk">Pupuk / Benih</SelectItem>
                      <SelectItem value="alat">Alat Mesin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-caption font-bold text-foreground">Berat (kg)</Label>
                  <Input
                    placeholder="Contoh: 100"
                    className="h-10 bg-white border-slate-200 text-caption"
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-primary hover:bg-primary-dark !text-white font-bold mt-4 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20">
                <Search className="size-4" />
                {LOGISTICS_CHECK_SHIPPING_COST.cta}
              </Button>
            </form>

            {result !== null && (
              <div className="mt-6 p-4 rounded-xl bg-white border border-primary/20 animate-in fade-in zoom-in-95">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="size-4 text-primary" />
                  <span className="text-caption font-bold text-slate-500 uppercase tracking-wider">Estimasi Biaya</span>
                </div>
                <p className="text-heading-2 font-black text-primary">{formatPrice(result)}</p>
                <p className="text-[10px] text-slate-400 mt-1 italic">*Harga dapat berubah sewaktu-waktu</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default CoverageAdvantagesSection;
