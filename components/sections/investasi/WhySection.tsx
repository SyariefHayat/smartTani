import { ShieldCheck, Eye, TrendingUp, Users, Sprout, Lock } from "lucide-react";
import { INVESTASI_KEUNGGULAN } from "@/constants/investasi";

export default function WhySection() {
  const icons = [ShieldCheck, Eye, TrendingUp, Users, Sprout, Lock];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-neutral-100 h-full">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#17391f] md:text-2xl">
          {INVESTASI_KEUNGGULAN.heading}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {INVESTASI_KEUNGGULAN.subtext}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {INVESTASI_KEUNGGULAN.items.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={item.title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f9f0] text-[#2D6A2D]">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#17391f]">{item.title}</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
