import { UserPlus, Search, Wallet, TrendingUp } from "lucide-react";
import { INVESTMENT_STEPS } from "@/constants/investments";
import { StepItem } from "@/components/ui/StepItem";

export default function HowSection() {
  const icons = [UserPlus, Search, Wallet, TrendingUp];

  return (
    <section id="cara-investasi">
      <div className="container-smarttani">
        <div className="rounded-[32px] bg-[#EAF3DE]/40 p-6 md:p-10">
          <div className="mb-10">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {INVESTMENT_STEPS.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
              {INVESTMENT_STEPS.subtext}
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-y-12 gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
              {INVESTMENT_STEPS.items.map((item, index) => {
                const Icon = icons[index];
                return (
                  <StepItem
                    key={item.step}
                    step={item.step}
                    icon={<Icon className="size-7" />}
                    title={item.title}
                    description={item.description}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


