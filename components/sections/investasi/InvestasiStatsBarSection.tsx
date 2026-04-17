import { Building2, Wallet, Users, TrendingUp, PieChart, Star } from "lucide-react";
import { INVESTASI_STATS_BAR } from "@/constants/investasi";
import { Separator } from "@/components/ui/separator";

export default function InvestasiStatsBarSection() {
  const icons = [Building2, Wallet, Users, TrendingUp, PieChart, Star];
  const total = INVESTASI_STATS_BAR.length;

  return (
    <section className="relative z-20 px-5 sm:px-8 md:px-10 lg:px-12 -mt-10 sm:-mt-12 md:-mt-14 lg:-mt-16">
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:p-8 lg:p-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-y-8 lg:gap-y-0">
          {INVESTASI_STATS_BAR.map((item, index) => {
            const Icon = icons[index];
            const isLast = index === total - 1;
            const isLastInRowTablet = (index + 1) % 3 === 0;

            return (
              <div
                key={item.label}
                className="relative flex flex-col items-center text-center px-2 py-2 lg:py-0"
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary-light text-primary md:size-12">
                  <Icon className="size-5 md:size-6" strokeWidth={2} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-heading-3 font-extrabold text-foreground whitespace-nowrap">
                    {item.value}
                  </h3>
                  <p className="text-caption text-muted-foreground sm:text-body-sm">
                    {item.label}
                  </p>
                </div>

                {/* Separator — desktop (6 kolom) */}
                {!isLast && (
                  <Separator
                    orientation="vertical"
                    className="absolute -right-px hidden lg:block h-full self-center bg-slate-200"
                  />
                )}

                {/* Separator — tablet (3 kolom) */}
                {!isLastInRowTablet && (
                  <Separator
                    orientation="vertical"
                    className="absolute -right-px hidden sm:block lg:hidden h-full self-center bg-slate-200"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
