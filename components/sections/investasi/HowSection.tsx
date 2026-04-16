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

      {/* Green mini CTA banner */}
      <div className="rounded-2xl bg-[#17391f] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
            <ShieldCheck className="size-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{INVESTASI_KEUNGGULAN.tagline}</h3>
            <p className="text-[11px] text-white/80">{INVESTASI_KEUNGGULAN.taglineSubtext}</p>
          </div>
        </div>
        <Button className="bg-white text-[#17391f] hover:bg-gray-100 text-xs h-9 px-6 font-bold rounded-full">
          {INVESTASI_KEUNGGULAN.ctaTagline}
        </Button>
      </div>
    </div>
  );
}
