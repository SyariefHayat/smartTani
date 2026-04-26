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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
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
                "flex flex-col items-center p-4 rounded-xl border-2 bg-white cursor-pointer transition-all duration-200 h-full hover:border-green-200 hover:shadow-md",
                selectedRole === item.id
                  ? "border-green-500 ring-1 ring-green-500"
                  : "border-gray-100"
              )}
            >
              <div className="relative w-full aspect-square mb-4 rounded-lg overflow-hidden bg-gray-50">
                <Image
                  src={roleImages[item.id] || "/images/placeholder.webp"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-gray-900 mb-1 text-center text-sm lg:text-base">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 text-center line-clamp-2">
                {item.description}
              </p>
              
              <div className={cn(
                "mt-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                selectedRole === item.id 
                  ? "border-green-600 bg-white" 
                  : "border-gray-200 bg-gray-50/50"
              )}>
                <div className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200 scale-0",
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
