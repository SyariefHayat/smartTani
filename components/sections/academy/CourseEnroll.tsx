"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Play, BookOpen, Infinity, Award } from "lucide-react";
import { Button } from "@/components/ui/button";

import { showToast } from "@/lib/toast";

export default function CourseEnroll() {
  const router = useRouter();
  const [enrolled, setEnrolled] = useState(false);
  const isFree = true; // For dummy

  const handleEnroll = () => {
    const auth = localStorage.getItem("smarttani-auth");
    if (!auth) {
      router.push(`/login?redirect=${window.location.pathname}`);
      return;
    }
    setEnrolled(true);
    showToast("✓ Selamat! Anda berhasil mendaftar kursus ini.", "success");
  };

  return (
    <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
      <div className="relative aspect-video">
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1A6B2F] shadow-lg transition-transform hover:scale-110">
            <Play className="h-6 w-6 fill-current ml-1" />
          </button>
        </div>
        <div className="absolute inset-0 bg-gray-200" />
        <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white uppercase tracking-widest z-10">
          Preview Kursus
        </p>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2">
          {isFree ? (
            <span className="text-3xl font-bold text-[#1A6B2F]">GRATIS</span>
          ) : (
            <span className="text-3xl font-bold text-gray-900">Rp 150.000</span>
          )}
        </div>

        <div className="mt-6">
          {enrolled ? (
            <div className="flex flex-col items-center gap-3 rounded-xl bg-green-50 p-4 border border-green-100">
              <CheckCircle2 className="h-8 w-8 text-[#1A6B2F]" />
              <p className="text-sm font-bold text-[#1A6B2F] text-center">
                ✓ Selamat! Anda berhasil mendaftar kursus ini.
              </p>
              <Button className="w-full bg-[#1A6B2F]" onClick={() => router.push('/dashboard/farmer')}>
                Ke Dashboard Saya
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-[#1A6B2F] py-6 text-lg font-bold hover:bg-[#145224]"
              onClick={handleEnroll}
            >
              Mulai Belajar Sekarang
            </Button>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <h4 className="text-sm font-bold text-gray-900">Benefit Kursus:</h4>
          {[
            { label: "Akses selamanya", icon: Infinity },
            { label: "Sertifikat resmi", icon: Award },
            { label: "12 Modul Video HD", icon: BookOpen },
            { label: "Materi terupdate", icon: CheckCircle2 },
            { label: "Dukungan instruktur", icon: Users },
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
              <benefit.icon className="h-4 w-4 text-[#1A6B2F]" />
              <span>{benefit.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Users = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
