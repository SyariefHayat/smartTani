import React from "react";
import { Lock } from "lucide-react";
import { LOGIN_HERO } from "@/constants/login";

export default function LoginHeader() {
  return (
    <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
      <div className="w-16 h-16 bg-primary/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg">
        <Lock size={28} strokeWidth={1.5} />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">
          {LOGIN_HERO.title}
        </h1>
        <p className="text-white/80 font-medium max-w-md">
          {LOGIN_HERO.subtitle}
        </p>
      </div>
    </div>
  );
}
