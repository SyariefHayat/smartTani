import React from "react";
import { UserPlus, ShoppingBasket, ShieldCheck, ChartColumnIncreasing, ChevronRight } from "lucide-react";
import { BERANDA_STEPS } from "@/constants";
import { StepItem } from "@/components/ui/StepItem";

const STEP_ICONS = [
  <UserPlus key="user" size={48} strokeWidth={1.5} />,
  <ShoppingBasket key="basket" size={48} strokeWidth={1.5} />,
  <ShieldCheck key="shield" size={48} strokeWidth={1.5} />,
  <ChartColumnIncreasing key="chart" size={48} strokeWidth={1.5} />,
];

export default function StepsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container-smarttani px-4">
        <div className="bg-[#F0F7F0] rounded-[16px] py-12 px-6 md:px-[60px] border-none shadow-none">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-[24px] font-bold text-[#1a3a1a] leading-tight">
              {BERANDA_STEPS.heading}
            </h2>
            <p className="text-[14px] text-[#555] mt-1">
              {BERANDA_STEPS.subtext}
            </p>
          </div>

          {/* Steps Grid */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 lg:gap-0">
            {BERANDA_STEPS.items.map((item, index) => (
              <React.Fragment key={item.step}>
                <StepItem
                  step={item.step}
                  icon={STEP_ICONS[index]}
                  title={item.title}
                  description={item.description}
                />
                {index < BERANDA_STEPS.items.length - 1 && (
                  <div className="hidden lg:flex items-center self-center mx-3">
                    <ChevronRight className="text-[#4a8c4a] size-5 stroke-[2.5px]" />
                  </div>
                )}
                {index < BERANDA_STEPS.items.length - 1 && (
                  <div className="lg:hidden flex items-center justify-center rotate-90">
                    <ChevronRight className="text-[#4a8c4a] size-5 stroke-[2.5px]" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
