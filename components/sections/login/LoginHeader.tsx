import React from "react";
import { Lock } from "lucide-react";
import { LOGIN_HERO } from "@/constants/login";

export default function LoginHeader() {
  return (
    <div className="flex flex-col items-center text-center space-y-4 mb-8">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <Lock size={24} fill="currentColor" fillOpacity={0.2} />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          {LOGIN_HERO.title}
        </h1>
        <p className="text-gray-600 max-w-md mx-auto">
          {LOGIN_HERO.subtitle}
        </p>
      </div>
    </div>
  );
}
