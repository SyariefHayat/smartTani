import { REGISTER_TRUST_BAR } from "@/constants/register";
import { ShieldCheck, Zap, LayoutGrid, Headset } from "lucide-react";

export default function RegisterTrustBarSection() {
  const icons = [ShieldCheck, Zap, LayoutGrid, Headset];

  return (
    <section className="bg-white py-12 border-t border-slate-100">
      <div className="container-smarttani">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
          {REGISTER_TRUST_BAR.map((item, index) => {
            const Icon = icons[index];
            return (
              <div key={item.title} className="flex flex-col items-center text-center md:flex-row md:text-left md:gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-[#2D6A2D] mb-4 md:mb-0">
                  <Icon className="size-7" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#17391f] md:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[10px] font-medium text-gray-500 md:text-xs">
                    {item.description}
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

