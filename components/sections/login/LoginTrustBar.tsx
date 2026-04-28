import React from "react";
import { LOGIN_TRUST_BAR } from "@/constants/login";
import { ShieldCheck, Zap, Headset } from "lucide-react";

const icons: Record<string, any> = {
  ShieldCheck,
  Zap,
  Headset,
};

export default function LoginTrustBar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">
      {LOGIN_TRUST_BAR.map((item, index) => {
        const Icon = icons[item.icon];
        return (
          <div key={index} className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-sm">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-sm">
                {item.title}
              </h4>
              <p className="text-xs font-medium text-white/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

