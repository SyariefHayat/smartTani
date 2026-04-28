"use client";

import React from "react";
import Image from "next/image";
import { LOGIN_MEMBERSHIP } from "@/constants/login";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const roleImages: Record<string, string> = {
  petani: "/images/register/farmer.webp",
  distributor: "/images/register/distributor.webp",
  investor: "/images/register/investor.webp",
  mitra_bisnis: "/images/register/business-partner.webp",
  admin_perusahaan: "/images/register/admin-company.webp",
};

export default function LoginMembership() {
  const [selectedRole, setSelectedRole] = React.useState("petani");

  return (
    <div className="space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-xl font-extrabold text-white mb-1">
          {LOGIN_MEMBERSHIP.title}
        </h2>
        <p className="text-sm font-medium text-white/70">
          {LOGIN_MEMBERSHIP.subtitle}
        </p>
      </div>

      <RadioGroup
        value={selectedRole}
        onValueChange={setSelectedRole}
        className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4"
      >
        {LOGIN_MEMBERSHIP.items.map((item) => (
          <div key={item.id} className="h-full">
            <RadioGroupItem
              value={item.id}
              id={item.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={item.id}
              className={cn(
                "group relative flex flex-col items-center h-full cursor-pointer rounded-2xl border-2 transition-all p-4 backdrop-blur-sm",
                selectedRole === item.id
                  ? "border-primary bg-primary/20 shadow-lg"
                  : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10"
              )}
            >
              {/* Image container */}
              <div className="relative size-12 md:size-14 shrink-0 overflow-hidden rounded-xl bg-white/10 mb-3 group-hover:scale-110 transition-transform">
                <Image
                  src={roleImages[item.id] || "/images/placeholder.webp"}
                  alt={item.title}
                  fill
                  className="object-contain p-1"
                />
              </div>

              {/* Text */}
              <div className="text-center">
                <h3 className={cn(
                  "text-[10px] md:text-xs font-bold leading-tight transition-colors",
                  selectedRole === item.id ? "text-white" : "text-white/80"
                )}>
                  {item.title}
                </h3>
              </div>

              {/* Radio indicator */}
              <div className={cn(
                "mt-3 size-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                selectedRole === item.id
                  ? "border-white bg-white"
                  : "border-white/30 bg-transparent"
              )}>
                {selectedRole === item.id && (
                  <div className="size-1.5 rounded-full bg-primary" />
                )}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
