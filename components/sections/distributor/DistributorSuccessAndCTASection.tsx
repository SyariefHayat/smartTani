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
    <section className="bg-white my-12">
      <div className="container-smarttani">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_450px]">
          {/* Left Side: Kisah Sukses Mitra */}
          <div className="flex flex-col">
            <div className="mb-10">
              <h2 className="text-heading-1 text-[#17391f]">
                {DISTRIBUTOR_TESTIMONI.heading}
              </h2>
              <p className="text-body-lg mt-4 text-[#5d7a64]">
                {DISTRIBUTOR_TESTIMONI.subtext}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {DISTRIBUTOR_TESTIMONI.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-6 rounded-3xl bg-[#f4f7f4] p-8 shadow-sm transition-all hover:shadow-md"
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
                      <h3 className="text-base font-bold text-[#17391f]">
                        {item.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#5d7a64] uppercase tracking-wider">
                        {item.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium leading-relaxed text-[#17391f]">
                      "{item.quote}"
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
          <div className="relative overflow-hidden rounded-3xl bg-[#17391f] p-10 text-white shadow-2xl lg:p-12">
            {/* Background Image overlay */}
            <div className="absolute inset-0 z-0">
              <Image
                src={DISTRIBUTOR_CTA_BANNER.image}
                alt="Smarttani Background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,#17391f_40%,rgba(23,57,31,0.7)_100%)]" />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <h2 className="mb-4 text-3xl font-bold leading-tight lg:text-3xl">
                {DISTRIBUTOR_CTA_BANNER.heading}
              </h2>
              <p className="mb-10 text-base font-medium opacity-90 leading-relaxed">
                {DISTRIBUTOR_CTA_BANNER.subtext}
              </p>

              <div className="mt-auto space-y-4">
                <Button
                  size="lg"
                  className="h-14 w-full bg-[#F5A623] text-base font-bold text-[#17391f] hover:bg-[#F5A623]/90 transition-all active:scale-95 cursor-pointer rounded-2xl shadow-lg shadow-black/20 border-none"
                >
                  {DISTRIBUTOR_CTA_BANNER.cta[0].label}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-full border-2 border-white bg-transparent text-base font-bold text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer rounded-2xl"
                >
                  <MessageCircle className="mr-3 size-5" />
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
