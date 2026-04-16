import { UserPlus, Search, Wallet, TrendingUp, ShieldCheck } from "lucide-react";
import { INVESTASI_STEPS, INVESTASI_KEUNGGULAN } from "@/constants/investasi";
import { StepItem } from "@/components/ui/StepItem";
import { Button } from "@/components/ui/button";

export default function HowSection() {
  const icons = [UserPlus, Search, Wallet, TrendingUp];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-100 h-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#17391f] md:text-2xl">
            {INVESTASI_STEPS.heading}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            {INVESTASI_STEPS.subtext}
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-4">
            {INVESTASI_STEPS.items.map((item, index) => {
              const Icon = icons[index];
              return (
                <StepItem
                  key={item.step}
                  step={item.step}
                  icon={<Icon className="size-8" />}
                  title={item.title}
                  description={item.description}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
