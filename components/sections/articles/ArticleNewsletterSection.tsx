"use client";

import React, { useState } from "react";
import { ARTICLE_NEWSLETTER } from "@/constants/article";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

const ArticleNewsletterSection = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      alert("Terima kasih! Email Anda telah terdaftar untuk menerima newsletter kami.");
      setEmail("");
    } else {
      alert("Silakan masukkan email yang valid.");
    }
  };

  return (
    <section className="mb-10">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl bg-[#1a4d2e] px-8 py-8 md:px-16">
          {/* Background Picture matching CTABannerSection */}
          <div className="absolute inset-0 z-0">
            <picture>
              <source
                media="(min-width: 1024px)"
                srcSet="/images/home/cta-desktop.webp"
              />
              <source
                media="(min-width: 640px)"
                srcSet="/images/home/cta-tablet.png"
              />
              <img
                src="/images/home/cta-mobile.png"
                alt="Newsletter Background"
                className="h-full w-full object-cover object-center"
              />
            </picture>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
            {/* Text Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                {ARTICLE_NEWSLETTER.heading}
              </h2>
              <p className="mt-3 text-sm font-medium text-[#eef8e5]/80 md:text-base">
                {ARTICLE_NEWSLETTER.subtext}
              </p>
            </div>

            {/* Newsletter Form */}
            <form
              onSubmit={handleSubscribe}
              className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:shrink-0"
            >
              <Input
                type="email"
                required
                placeholder={ARTICLE_NEWSLETTER.inputPlaceholder}
                className="h-12 w-full sm:w-64 md:w-80 rounded-lg border-white/20 bg-white/10 px-6 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-white/40 text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="submit"
                className="h-12 rounded-lg border-none bg-[#FFB21C] px-8 text-sm font-bold text-white hover:bg-[#FFB21C]/90 cursor-pointer shadow-lg shadow-black/10"
              >
                {ARTICLE_NEWSLETTER.cta}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleNewsletterSection;