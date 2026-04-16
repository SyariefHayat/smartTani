import { Building2, Wallet, Users, TrendingUp, PieChart, Star } from "lucide-react";
import { INVESTASI_STATS_BAR } from "@/constants/investasi";

export default function InvestasiStatsBarSection() {
  const icons = [Building2, Wallet, Users, TrendingUp, PieChart, Star];

  return (
    <section className="relative z-20 px-5 sm:px-8 md:px-10 lg:px-12">
      {/* Container ini tidak menggunakan negative margin, tapi akan didorong oleh Hero di atasnya */}
      <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:p-8 lg:p-10">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-3 md:grid-cols-6 md:gap-y-0">
          {INVESTASI_STATS_BAR.map((item, index) => {
            const Icon = icons[index];
            return (
              <div 
                key={item.label} 
                className="flex flex-col items-center text-center px-2"
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-[#EAF3DE] text-[#2D6A2D] md:size-12">
                  <Icon className="size-5 md:size-6" strokeWidth={2} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-[#17391f] md:text-xl lg:text-2xl whitespace-nowrap">
                    {item.value}
                  </h3>
                  <p className="text-[10px] font-medium text-[#5d7a64] sm:text-xs md:text-sm">
                    {item.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
