import { ShieldCheck, Eye, TrendingUp, Users, Sprout, Lock } from "lucide-react";
import { INVESTASI_KEUNGGULAN } from "@/constants/investasi";

export default function WhySection() {
  const icons = [ShieldCheck, Eye, TrendingUp, Users, Sprout, Lock];

  return (
    <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100 h-full">
      <div className="mb-8">
        <h2 className="text-heading-2 text-foreground">
          {INVESTASI_KEUNGGULAN.heading}
        </h2>
        <p className="mt-2 text-body-sm text-muted-foreground">
          {INVESTASI_KEUNGGULAN.subtext}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {INVESTASI_KEUNGGULAN.items.map((item, index) => {
          const Icon = icons[index];
          return (
            <div key={item.title} className="flex gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="text-body-sm font-bold text-foreground">{item.title}</h3>
                <p className="mt-1 text-caption text-muted-foreground">
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
