"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOGISTIC_HERO } from "@/constants/logistic";
import { ShieldCheck, Truck, Globe, Search, CheckCircle2, Clock } from "lucide-react";

const ICON_MAP = [ShieldCheck, Truck, Globe];

const LogisticHeroSection = () => {
  const [trackingNo, setTrackingNo] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNo.trim()) {
      setShowTracking(true);
    }
  };

  return (
    <section className="relative min-h-[500px] lg:min-h-[650px] flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={LOGISTIC_HERO.image}
        alt="Logistic Smarttani"
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/20 lg:via-primary-dark/60 lg:to-transparent" />

      {/* Content */}
      <div className="container-smarttani relative z-10 py-16 pb-24 lg:py-24 lg:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

          {/* Left Column */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Badge */}
            <div className="mb-6 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-4 py-2 text-caption font-bold text-white md:text-body-sm">
              Logistik Pertanian
            </div>

            <h1 className="text-display mb-6 text-white max-w-2xl">
              {LOGISTIC_HERO.heading}
            </h1>

            <p className="text-body-lg mb-10 max-w-xl text-white/85">
              {LOGISTIC_HERO.subtext}
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {LOGISTIC_HERO.badges.map((badge, index) => {
                const Icon = ICON_MAP[index] || ShieldCheck;
                return (
                  <div
                    key={index}
                    className="flex flex-row items-center gap-3 rounded-xl bg-white p-4 shadow-lg transition-all hover:translate-y-[-4px]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-foreground leading-tight">
                        {badge.label}
                      </p>
                      <p className="mt-1 text-caption text-muted-foreground uppercase tracking-wider">
                        {badge.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Tracking Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              <h3 className="text-heading-3 font-bold text-foreground mb-1">
                {LOGISTIC_HERO.tracking.label}
              </h3>
              <p className="text-body-sm text-muted-foreground mb-6">
                {LOGISTIC_HERO.tracking.placeholder}
              </p>

              <form onSubmit={handleTracking} className="space-y-4">
                <Input
                  type="text"
                  placeholder={LOGISTIC_HERO.tracking.inputHint}
                  className="h-12 border-slate-200 bg-slate-50 px-4 focus:ring-primary rounded-xl"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                />

                <Button 
                  type="submit"
                  className="h-12 w-full bg-primary text-base font-bold !text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                  <Search className="mr-2 h-5 w-5" />
                  {LOGISTIC_HERO.tracking.ctaPrimary}
                </Button>

                <button 
                  type="button"
                  className="flex w-full items-center justify-center gap-2 text-body-sm font-bold text-primary hover:text-primary/80 transition-colors py-2 group"
                >
                  {LOGISTIC_HERO.tracking.ctaSecondary}
                </button>
              </form>

              {showTracking && (
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">No. Resi: {trackingNo}</span>
                    <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">DIKIRIM</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "Pesanan Diterima", date: "12 Mei, 08:30", done: true },
                      { label: "Diproses", date: "12 Mei, 10:45", done: true },
                      { label: "Dalam Perjalanan", date: "13 Mei, 14:20", done: true },
                    ].map((step, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <div className="mt-1">
                          <CheckCircle2 className="size-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800 leading-none">{step.label}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">{step.date}</p>
                        </div>
                      </div>
                    ))}
                    <div className="flex gap-3 items-start opacity-50">
                      <div className="mt-1">
                        <Clock className="size-3.5 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800 leading-none">Estimasi Tiba</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">15 Mei 2024</p>
                      </div>
                    </div>
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

export default LogisticHeroSection;