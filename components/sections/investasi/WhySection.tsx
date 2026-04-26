import { ShieldCheck, Eye, TrendingUp, Users, Sprout, Lock } from "lucide-react";
import { INVESTASI_KEUNGGULAN } from "@/constants/investasi";

export default function WhySection() {
  const icons = [ShieldCheck, Eye, TrendingUp, Users, Sprout, Lock];

  return (
    <section className="">
      <div className="container-smarttani">
        <div className="rounded-[32px] bg-[#EAF3DE]/60 px-6 py-10 md:px-12 md:py-12">
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {INVESTASI_KEUNGGULAN.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
              {INVESTASI_KEUNGGULAN.subtext}
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6 items-stretch">
            {INVESTASI_KEUNGGULAN.items.map((item, index) => {
              const Icon = icons[index];
              return (
                <div key={item.title} className="flex flex-col items-center text-center">
                  <div className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
                    <Icon className="size-7" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-base font-extrabold text-[#17391f]">{item.title}</h3>
                    <p className="text-xs leading-relaxed text-[#5d7a64] md:text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
