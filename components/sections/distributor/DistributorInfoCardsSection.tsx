import React from "react";
import Image from "next/image";
import {
  Check,
  TrendingUp,
  ClipboardCheck,
  GraduationCap,
  Truck,
  ArrowRight,
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
  return (
    <section className="bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Card 1: Syarat Menjadi Distributor */}
          <div className="flex flex-col rounded-3xl bg-[#f4f7f4] p-8 shadow-sm transition-all hover:shadow-md">
            <h3 className="mb-3 text-2xl font-bold text-[#17391f]">
              {DISTRIBUTOR_SYARAT.heading}
            </h3>
            <p className="mb-8 text-base font-medium text-[#5d7a64]">
              {DISTRIBUTOR_SYARAT.subtext}
            </p>

            <div className="space-y-5 flex-1">
              {DISTRIBUTOR_SYARAT.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="size-3.5" strokeWidth={4} />
                  </div>
                  <p className="text-base font-bold text-[#17391f] leading-tight">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-2xl bg-primary/5 p-5 text-center border border-primary/10">
              <p className="text-sm font-bold text-[#245a2f] leading-relaxed italic">
                {DISTRIBUTOR_SYARAT.note}
              </p>
            </div>
          </div>

          {/* Card 2: Bagaimana Cara Bergabung? */}
          <div className="flex flex-col rounded-3xl bg-[#f4f7f4] p-8 shadow-sm transition-all hover:shadow-md">
            <h3 className="mb-3 text-2xl font-bold text-[#17391f]">
              {DISTRIBUTOR_STEPS.heading}
            </h3>
            <p className="mb-10 text-base font-medium text-[#5d7a64]">
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
                      <span className="text-2xl font-black text-primary/10 transition-colors group-hover:text-primary/30">
                        0{item.step}
                      </span>
                      <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-sm text-primary transition-transform group-hover:scale-110">
                        <Icon className="size-5" />
                      </div>
                    </div>

                    <h4 className="mb-2 text-sm font-bold text-[#17391f] leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs font-medium text-[#5d7a64] leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Lokasi Distributor */}
          <div className="flex flex-col rounded-3xl bg-[#f4f7f4] p-8 shadow-sm transition-all hover:shadow-md">
            <h3 className="mb-3 text-2xl font-bold text-[#17391f]">
              Lokasi Distributor
            </h3>
            <p className="mb-6 text-base font-medium text-[#5d7a64]">
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
              <h4 className="text-base font-bold text-[#17391f]">
                Cari Distributor Terdekat
              </h4>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Masukkan kota..."
                    className="h-12 bg-white border-slate-200 text-sm pl-4 rounded-xl focus:ring-primary/20"
                  />
                </div>
                <Button className="h-12 px-6 bg-primary hover:bg-primary-dark font-bold rounded-xl cursor-pointer shadow-lg shadow-primary/20 transition-all active:scale-95">
                  Cari
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributorInfoCardsSection;
