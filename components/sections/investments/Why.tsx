import { ShieldCheck, Eye, TrendingUp, Users, Sprout, Lock } from "lucide-react";
import { INVESTMENT_ADVANTAGES } from "@/constants/investments";

export default function Why() {
  const icons = [ShieldCheck, Eye, TrendingUp, Users, Sprout, Lock];

  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="rounded-[32px] bg-[#EAF3DE]/40 p-6 md:p-10">
          <div className="mb-10">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {INVESTMENT_ADVANTAGES.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-[#5d7a64] md:text-base">
              {INVESTMENT_ADVANTAGES.subtext}
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {INVESTMENT_ADVANTAGES.items.map((item, index) => {
              const Icon = icons[index];
              return (
                <div key={item.title} className="flex gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[#d4edda] text-[#2D6A2D]">
                    <Icon className="size-7" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-base font-extrabold text-[#17391f] md:text-lg">{item.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#5d7a64] md:text-sm">
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

