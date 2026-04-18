import { HOME_STEPS, STEP_ICONS } from "@/constants";
import { ChevronRight, UserPlus } from "lucide-react";

export default function StepsSection() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="rounded-[32px] bg-[#EAF3DE]/60 px-6 py-12 md:px-12">
          {/* Header */}
          <div className="mb-12 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold text-[#17391f] md:text-2xl">
              Bagaimana Smarttani Bekerja?
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64]">
              4 langkah mudah untuk memulai
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
            {HOME_STEPS.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? UserPlus;
              return (
                <div key={step.step} className="flex flex-1 items-center gap-4">
                  <div className="flex flex-1 items-center gap-3">
                    {/* Step Number */}
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#2D6A2D] text-[13px] font-bold text-white">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="flex size-12 shrink-0 items-center justify-center text-[#2D6A2D]">
                      <Icon
                        className="size-8"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col">
                      <h3 className="text-[15px] font-bold leading-tight text-[#17391f]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[12px] leading-tight text-[#5d7a64]">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  {/* Separator */}
                  {index < HOME_STEPS.length - 1 && (
                    <div className="hidden lg:block">
                      <ChevronRight
                        className="size-6 text-[#2D6A2D]/40"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </div>
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
