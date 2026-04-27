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
    <section className="pb-10 md:pb-14">
      <div className="container-smarttani">
        <div className="relative overflow-hidden rounded-2xl bg-[#1a4d2e] p-8 md:p-12 lg:p-16">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home/cta-background-2.webp"
              alt="Background Pattern"
              fill
              className="object-cover object-center opacity-40 lg:opacity-100"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

            {/* Kiri: Heading & Subtext */}
            <div className="max-w-xl text-center lg:text-left">
              <h2 className="text-2xl font-extrabold leading-tight text-white md:text-3xl lg:text-4xl mb-6">
                {ARTICLE_NEWSLETTER.heading}
              </h2>
              <p className="text-sm font-medium text-[#eef8e5]/90 md:text-base leading-relaxed">
                {ARTICLE_NEWSLETTER.subtext}
              </p>
            </div>

            {/* Kanan: Input & Button */}
            <form 
              onSubmit={handleSubscribe}
              className="flex flex-col gap-4 sm:flex-row sm:items-center lg:justify-end w-full"
            >
              <Input
                type="email"
                required
                placeholder={ARTICLE_NEWSLETTER.inputPlaceholder}
                className="h-14 flex-1 border-white/20 bg-white/10 px-6 text-white placeholder:text-white/60 focus-visible:ring-accent rounded-xl text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit" className="h-14 bg-accent px-10 font-extrabold text-white hover:bg-accent/90 transition-all border-none whitespace-nowrap cursor-pointer rounded-xl shadow-lg shadow-black/10">
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