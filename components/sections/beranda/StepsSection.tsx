import { HOME_STEPS, STEP_ICONS } from "@/constants";
import { ChevronRight, UserPlus } from "lucide-react";
import Link from "next/link";

export default function StepsSection() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="rounded-[32px] bg-[#EAF3DE]/60 px-6 py-10 md:px-12 md:py-12">

          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              Bagaimana Smarttani Bekerja?
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
              4 langkah mudah untuk memulai
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:flex lg:flex-row lg:items-start lg:gap-4">
            {HOME_STEPS.map((step, index) => {
              const Icon = STEP_ICONS[index] ?? UserPlus;
              const isFirst = step.step === 1;
              const isLast = index === HOME_STEPS.length - 1;

              const stepCard = (
                <div className="flex w-full flex-col items-center gap-4 text-center">
                  {/* Icon */}
                  <div className="flex size-16 shrink-0 items-center justify-center text-[#2D6A2D]">
                    <Icon className="size-12" strokeWidth={1.5} aria-hidden="true" />
                  </div>

                  {/* Text */}
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-base font-extrabold text-[#17391f] md:text-lg">
                      {step.title}
                    </h3>
                    <p className="max-w-[200px] text-xs leading-relaxed text-[#5d7a64] md:text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              );

              return (
                <div key={step.step} className="flex flex-col items-center lg:flex-1 lg:flex-row lg:items-start lg:gap-4">
                  {isFirst ? (
                    <Link
                      href="/signup"
                      className="flex w-full flex-col items-center transition-opacity hover:opacity-80"
                    >
                      {stepCard}
                    </Link>
                  ) : (
                    <div className="flex w-full flex-col items-center">
                      {stepCard}
                    </div>
                  )}

                  {/* Separator — desktop only */}
                  {!isLast && (
                    <ChevronRight
                      className="hidden size-5 shrink-0 text-[#2D6A2D]/40 lg:block lg:mt-7"
                      strokeWidth={1.5}
                      aria-hidden="true"
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