import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import {
  DISTRIBUTOR_TESTIMONI,
  DISTRIBUTOR_CTA_BANNER,
} from "@/constants/distributor";
import { Button } from "@/components/ui/button";

const DistributorSuccessSection = () => {
  return (
    <section className="pb-12 md:pb-20 bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_450px]">
          {/* Left Side: Kisah Sukses Mitra */}
          <div className="flex flex-col">
            <div className="mb-10">
              <h2 className="section-title text-foreground">
                {DISTRIBUTOR_TESTIMONI.heading}
              </h2>
              <p className="text-body-lg mt-4 text-muted-foreground">
                {DISTRIBUTOR_TESTIMONI.subtext}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {DISTRIBUTOR_TESTIMONI.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-6 rounded-2xl bg-slate-50 p-8 border border-slate-100 transition-all hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-body font-bold text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-caption font-semibold text-muted-foreground uppercase tracking-wider">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-body-sm font-medium text-foreground">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2">
                    <StarRating rating={item.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: CTA Banner Box */}
          <div className="relative overflow-hidden rounded-2xl bg-primary-dark p-10 text-white shadow-2xl lg:p-12">
            {/* Background Image overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={DISTRIBUTOR_CTA_BANNER.image}
                alt="Smarttani Background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/70" />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <h2 className="text-heading-1 text-white mb-4">
                {DISTRIBUTOR_CTA_BANNER.heading}
              </h2>
              <p className="text-body text-white/85 mb-10">
                {DISTRIBUTOR_CTA_BANNER.subtext}
              </p>

              <div className="mt-auto space-y-4">
                <Button
                  size="lg"
                  asChild
                  className="h-14 w-full bg-accent text-base font-bold !text-white hover:bg-accent/90 transition-all active:scale-95 cursor-pointer rounded-2xl shadow-lg shadow-black/20 border-none"
                >
                  <Link href="/register?role=distributor">
                    {DISTRIBUTOR_CTA_BANNER.cta[0].label}
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-14 w-full border-2 border-white bg-transparent text-base font-bold text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer rounded-2xl"
                >
                  <Link href="/contact" className="flex items-center justify-center">
                    <MessageCircle className="mr-3 size-5" />
                    {DISTRIBUTOR_CTA_BANNER.cta[1].label}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributorSuccessSection;
