import React from "react";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import {
  DISTRIBUTOR_TESTIMONI,
  DISTRIBUTOR_CTA_BANNER,
} from "@/constants/distributor";
import { Button } from "@/components/ui/button";

const DistributorSuccessAndCTASection = () => {
  return (
    <section className="my-8 bg-white">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px]">
          {/* Left Side: Kisah Sukses Mitra */}
          <div className="flex flex-col">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
                {DISTRIBUTOR_TESTIMONI.heading}
              </h2>
              <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
                {DISTRIBUTOR_TESTIMONI.subtext}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {DISTRIBUTOR_TESTIMONI.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 rounded-2xl bg-[#F9FAF9] p-6 shadow-sm border border-neutral-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-sm">
                      <Image
                        src={item.avatar}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#17391f]">
                        {item.name}
                      </h3>
                      <p className="text-[10px] font-medium text-[#5d7a64]">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-medium leading-relaxed text-[#17391f]">
                      "{item.quote}"
                    </p>
                  </div>

                  <div className="mt-1">
                    <StarRating rating={item.rating} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: CTA Banner Box */}
          <div className="relative overflow-hidden rounded-2xl bg-[#17391f] p-8 text-white shadow-xl lg:mt-4">
            {/* Background Image overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={DISTRIBUTOR_CTA_BANNER.image}
                alt="Smarttani Background"
                fill
                className="object-cover opacity-30 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,57,31,0.8)_0%,#17391f_100%)]" />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <h2 className="mb-4 text-2xl font-extrabold leading-tight md:text-3xl">
                {DISTRIBUTOR_CTA_BANNER.heading}
              </h2>
              <p className="mb-8 text-sm font-medium opacity-90">
                {DISTRIBUTOR_CTA_BANNER.subtext}
              </p>

              <div className="mt-auto space-y-3">
                <Button
                  size="lg"
                  className="h-12 w-full bg-[#FFA500] text-sm font-extrabold text-[#17391f] hover:bg-[#FFB833] transition-all active:scale-95 cursor-pointer rounded-xl"
                >
                  {DISTRIBUTOR_CTA_BANNER.cta[0].label}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full border-2 border-white/40 bg-white/10 text-sm font-extrabold text-white backdrop-blur-sm hover:bg-white/20 transition-all active:scale-95 cursor-pointer rounded-xl"
                >
                  <MessageCircle className="mr-2 size-4" />
                  {DISTRIBUTOR_CTA_BANNER.cta[1].label}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributorSuccessAndCTASection;
