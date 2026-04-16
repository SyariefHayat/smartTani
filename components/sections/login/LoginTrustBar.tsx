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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100 mt-12">
      {LOGIN_TRUST_BAR.map((item, index) => {
        const Icon = icons[item.icon];
        return (
          <div key={index} className="flex items-start space-x-4">
            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
              <Icon size={24} />
            </div>
            <div className="space-y-1 text-left">
              <h4 className="font-bold text-gray-900 text-sm">
                {item.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
