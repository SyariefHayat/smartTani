"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOGISTICS_HERO } from "@/constants/logistics";
import { ShieldCheck, Truck, Globe, Search, ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { showToast } from "@/lib/toast";

const Hero = () => {
  const [trackingNo, setTrackingNo] = useState("");
  const [showResult, setShowResult] = useState(false);

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNo.trim()) {
      showToast('Masukkan nomor resi dulu', 'warning');
      return;
    }
    setShowResult(true);
  };

  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={LOGISTICS_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={LOGISTICS_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={LOGISTICS_HERO.bgImageMobile} />
          <img
            src={LOGISTICS_HERO.bgImageDesktop}
            alt="Logistic Smarttani"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0 mt-2">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-9 text-white mt-9 md:mt-0">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {LOGISTICS_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {LOGISTICS_HERO.heading}
            </h1>

            <p className="text-body-sm max-w-sm md:max-w-md text-white/85">
              {LOGISTICS_HERO.subtext}
            </p>
          </div>

          {/* Right Column: Tracking Form & Result */}
          <div className="md:col-span-4 lg:col-span-3 flex md:justify-end lg:justify-end">
            <div className="w-full lg:max-w-xs rounded-2xl bg-white p-4 md:p-5 shadow-2xl overflow-hidden">
              {!showResult ? (
                <>
                  <h3 className="text-base font-extrabold text-[#17391f] mb-1">
                    {LOGISTICS_HERO.tracking.label}
                  </h3>
                  <p className="text-sm font-medium text-[#5d7a64] mb-5">
                    {LOGISTICS_HERO.tracking.placeholder}
                  </p>

                  <div className="space-y-3">
                    <form onSubmit={handleTracking} className="space-y-3">
                      <Input
                        type="text"
                        placeholder={LOGISTICS_HERO.tracking.inputHint}
                        className="h-10 border-slate-200 bg-slate-50 px-4 focus:ring-primary rounded-xl text-sm font-bold"
                        value={trackingNo}
                        onChange={(e) => setTrackingNo(e.target.value)}
                      />
                      <Button
                        type="submit"
                        className="h-11 w-full bg-primary text-sm font-bold !text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 cursor-pointer"
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {LOGISTICS_HERO.tracking.ctaPrimary}
                      </Button>
                    </form>

                    <button
                      type="button"
                      className="flex w-full items-center justify-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all py-1.5 group cursor-pointer"
                    >
                      {LOGISTICS_HERO.tracking.ctaSecondary}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-extrabold text-[#17391f]">Hasil Pelacakan</h3>
                    <button
                      onClick={() => setShowResult(false)}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      Ubah No. Resi
                    </button>
                  </div>
                  <div className="bg-[#EAF3DE]/40 rounded-xl p-3 mb-4 border border-[#d4edda]">
                    <p className="text-[10px] text-[#5d7a64] uppercase font-bold tracking-wider">No. Resi</p>
                    <p className="text-sm font-extrabold text-[#17391f]">{trackingNo}</p>
                  </div>
                  <div className="space-y-4">
                    {[
                      { title: "Pesanan Diterima", date: "Kemarin, 14:20", done: true },
                      { title: "Diproses di Gudang", date: "Kemarin, 18:45", done: true },
                      { title: "Dalam Perjalanan", date: "Hari ini, 09:10", done: true },
                      { title: "Estimasi Tiba", date: "Besok, 12:00", done: false },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          {step.done ? (
                            <CheckCircle2 className="size-4 text-primary" />
                          ) : (
                            <Circle className="size-4 text-slate-300" />
                          )}
                          {i < 3 && <div className={`w-0.5 h-6 ${step.done ? 'bg-primary' : 'bg-slate-200'}`} />}
                        </div>
                        <div>
                          <p className={`text-xs font-extrabold ${step.done ? 'text-[#17391f]' : 'text-slate-400'}`}>
                            {step.title}
                          </p>
                          <p className="text-[10px] font-medium text-[#5d7a64]">{step.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;