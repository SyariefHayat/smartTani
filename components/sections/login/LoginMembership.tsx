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
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {LOGIN_MEMBERSHIP.title}
        </h2>
        <p className="text-gray-600">
          {LOGIN_MEMBERSHIP.subtitle}
        </p>
      </div>

      <RadioGroup
        value={selectedRole}
        onValueChange={setSelectedRole}
        className="flex flex-col gap-1 lg:grid lg:grid-cols-5 lg:gap-4"
      >
        {LOGIN_MEMBERSHIP.items.map((item) => (
          <div key={item.id}>
            <RadioGroupItem
              value={item.id}
              id={item.id}
              className="peer sr-only"
            />
            <Label
              htmlFor={item.id}
              className={cn(
                "relative flex cursor-pointer items-center gap-3",
                "rounded-xl border transition-all",
                "p-2.5 md:p-4",
                "hover:border-green-200",
                selectedRole === item.id
                  ? "border-[#2D6A2D] bg-[#EAF3DE]/30"
                  : "border-slate-100 bg-white",
                "lg:flex-col lg:items-center lg:p-4 lg:rounded-xl",
                "lg:border-2 lg:h-full lg:hover:shadow-md"
              )}
            >
              {/* Gambar: tampil di SEMUA ukuran layar */}
              {/* Mobile: size-10, Desktop: size-16 ke atas */}
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-slate-50 md:size-16 lg:w-full lg:h-auto lg:aspect-square lg:rounded-xl lg:mb-2">
                <Image
                  src={roleImages[item.id] || "/images/placeholder.webp"}
                  alt={item.title}
                  fill
                  className="object-contain p-1"
                />
              </div>

              {/* Teks nama + deskripsi */}
              <div className="flex-1 lg:text-center">
                <h3 className="text-xs font-extrabold text-[#17391f] md:text-sm lg:mb-1 lg:text-base">
                  {item.title}
                </h3>
                {/* Deskripsi: hidden mobile, tampil desktop */}
                <p className="hidden lg:block text-xs text-gray-500 text-center line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Radio indicator */}
              <div className={cn(
                "size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                "lg:mt-3",
                selectedRole === item.id
                  ? "border-[#2D6A2D] bg-[#2D6A2D]"
                  : "border-slate-200 bg-white"
              )}>
                {selectedRole === item.id && (
                  <div className="size-2 rounded-full bg-white" />
                )}
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
