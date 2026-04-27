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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200",
                "border border-transparent",
                "lg:flex-col lg:items-center lg:p-4 lg:rounded-xl lg:border-2 lg:h-full lg:hover:border-green-200 lg:hover:shadow-md",
                selectedRole === item.id
                  ? "bg-green-50 border-green-400 lg:border-green-500 lg:ring-1 lg:ring-green-500"
                  : "hover:bg-gray-50 lg:border-gray-100 lg:bg-white"
              )}
            >
              {/* Gambar: HANYA tampil di desktop */}
              <div className="hidden lg:block relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={roleImages[item.id] || "/images/placeholder.webp"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Ikon kecil: HANYA tampil di mobile */}
              <div className={cn(
                "flex lg:hidden size-8 shrink-0 items-center justify-center rounded-lg",
                selectedRole === item.id 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-500"
              )}>
                {item.id === "petani" && <span className="text-sm">🌾</span>}
                {item.id === "distributor" && <span className="text-sm">🚛</span>}
                {item.id === "investor" && <span className="text-sm">📈</span>}
                {item.id === "mitra_bisnis" && <span className="text-sm">🤝</span>}
                {item.id === "admin_perusahaan" && <span className="text-sm">🏢</span>}
              </div>

              {/* Teks: tampil di semua ukuran */}
              <div className="flex-1 lg:text-center">
                <h3 className="font-bold text-gray-900 text-sm lg:mb-1 lg:text-base">
                  {item.title}
                </h3>
                {/* Deskripsi: hidden di mobile, tampil di desktop */}
                <p className="hidden lg:block text-xs text-gray-500 text-center line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Radio indicator: tampil di semua ukuran */}
              <div className={cn(
                "size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200",
                "lg:mt-4",
                selectedRole === item.id
                  ? "border-green-600 bg-white"
                  : "border-gray-200 bg-gray-50/50"
              )}>
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-200 scale-0",
                  selectedRole === item.id && "bg-green-600 scale-100"
                )} />
              </div>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
