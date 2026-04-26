import { UserPlus, Search, Wallet, TrendingUp, ChevronRight } from "lucide-react";
import { INVESTASI_STEPS } from "@/constants/investasi";

export default function HowSection() {
  const icons = [UserPlus, Search, Wallet, TrendingUp];

  return (
    <section className="section-padding" id="cara-investasi">
      <div className="container-smarttani">
        <div className="rounded-[32px] bg-[#EAF3DE]/60 px-6 py-10 md:px-12 md:py-12">
          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {INVESTASI_STEPS.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
              {INVESTASI_STEPS.subtext}
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-10 lg:flex lg:flex-row lg:items-start lg:gap-4">
            {INVESTASI_STEPS.items.map((item, index) => {
              const Icon = icons[index];
              const isLast = index === INVESTASI_STEPS.items.length - 1;

              return (
                <div key={item.step} className="flex flex-col items-center lg:flex-1 lg:flex-row lg:items-start lg:gap-4">
                  <div className="flex w-full flex-col items-center gap-4 text-center">
                    {/* Icon */}
                    <div className="mb-1 flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
                      <Icon className="size-7" />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-center gap-1">
                      <h3 className="text-base font-extrabold text-[#17391f] md:text-lg">
                        {item.title}
                      </h3>
                      <p className="max-w-[200px] text-xs leading-relaxed text-[#5d7a64] md:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Separator — desktop only */}
                  {!isLast && (
                    <ChevronRight
                      className="hidden size-5 shrink-0 text-[#2D6A2D]/40 lg:block lg:mt-7"
                      strokeWidth={1.5}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
