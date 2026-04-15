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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Card 1: Syarat Menjadi Distributor */}
          <div className="flex flex-col rounded-2xl bg-[#F9FAF9] p-6 shadow-sm border border-neutral-100">
            <h3 className="mb-2 text-xl font-extrabold text-[#17391f] md:text-2xl">
              {DISTRIBUTOR_SYARAT.heading}
            </h3>
            <p className="mb-6 text-sm font-medium text-[#5d7a64]">
              {DISTRIBUTOR_SYARAT.subtext}
            </p>

            <div className="space-y-4 flex-1">
              {DISTRIBUTOR_SYARAT.items.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="size-3.5" strokeWidth={3} />
                  </div>
                  <p className="text-sm font-semibold text-[#17391f] leading-tight">
                    {item}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-[#EDF3ED] p-4 text-center">
              <p className="text-xs font-bold text-[#245a2f] leading-relaxed">
                {DISTRIBUTOR_SYARAT.note}
              </p>
            </div>
          </div>

          {/* Card 2: Bagaimana Cara Bergabung? */}
          <div className="flex flex-col rounded-2xl bg-[#F9FAF9] p-6 shadow-sm border border-neutral-100">
            <h3 className="mb-2 text-xl font-extrabold text-[#17391f] md:text-2xl">
              {DISTRIBUTOR_STEPS.heading}
            </h3>
            <p className="mb-8 text-sm font-medium text-[#5d7a64]">
              {DISTRIBUTOR_STEPS.subtext}
            </p>

            <div className="grid grid-cols-4 gap-2 relative">
              {DISTRIBUTOR_STEPS.items.map((item, index) => {
                const Icon = STEP_ICONS[index] || TrendingUp;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center relative"
                  >
                    <span className="mb-4 text-2xl font-black text-primary/20">
                      {item.step}
                    </span>

                    <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-white shadow-sm text-primary">
                      <Icon className="size-6" />
                    </div>

                    <h4 className="mb-1 text-[11px] font-extrabold text-[#17391f] leading-tight px-1">
                      {item.title}
                    </h4>
                    <p className="hidden md:block text-[9px] font-medium text-[#5d7a64] leading-tight">
                      {item.description}
                    </p>

                    {/* Arrow for desktop */}
                    {index < DISTRIBUTOR_STEPS.items.length - 1 && (
                      <div className="absolute top-16 -right-2 z-10 hidden lg:block text-neutral-300">
                        <ArrowRight className="size-4" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 3: Lokasi Distributor */}
          <div className="flex flex-col rounded-2xl bg-[#F9FAF9] p-6 shadow-sm border border-neutral-100">
            <h3 className="mb-2 text-xl font-extrabold text-[#17391f] md:text-2xl">
              Lokasi Distributor
            </h3>
            <p className="mb-4 text-sm font-medium text-[#5d7a64]">
              Jaringan kami tersebar di seluruh Indonesia.
            </p>

            <div className="relative mb-6 flex-1 flex items-center justify-center bg-white/50 rounded-xl overflow-hidden p-2">
              <Image
                src={DISTRIBUTOR_MAP.image}
                alt="Peta Distributor Smarttani"
                width={400}
                height={250}
                className="object-contain"
              />
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#17391f]">
                Cari Distributor Terdekat
              </h4>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Masukkan kota atau provinsi..."
                    className="h-11 bg-white border-neutral-200 text-sm pl-4 rounded-lg"
                  />
                </div>
                <Button className="h-11 px-6 bg-primary hover:bg-primary-dark font-bold rounded-lg cursor-pointer">
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
