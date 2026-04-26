import { UserPlus, Search, Wallet, TrendingUp } from "lucide-react";
import { INVESTMENT_STEPS } from "@/constants/investments";
import { StepItem } from "@/components/ui/StepItem";

export default function HowSection() {
  const icons = [UserPlus, Search, Wallet, TrendingUp];

  return (
    <div className="flex flex-col gap-6 h-full" id="cara-investasi">
      <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100 h-full">
        <div className="mb-8">
          <h2 className="text-heading-2 text-foreground">
            {INVESTMENT_STEPS.heading}
          </h2>
          <p className="mt-2 text-body-sm text-muted-foreground">
            {INVESTMENT_STEPS.subtext}
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-4">
            {INVESTMENT_STEPS.items.map((item, index) => {
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

