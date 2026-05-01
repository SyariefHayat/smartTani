"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2, ArrowLeft, Loader2, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState<"input" | "sent">("input");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email tidak boleh kosong.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format email tidak valid.");
      return;
    }

    setLoading(true);
    // Simulasi kirim email
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setStep("sent");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/register/login-hero.webp')",
          filter: "brightness(0.9)",
        }}
      />
      <div className="absolute inset-0 z-1 bg-black/10" />

      {/* Card Container */}
      <div className="relative z-10 w-full max-w-xl bg-white/95 backdrop-blur-sm rounded-[2.5rem] shadow-xl p-8 md:p-12 transform transition-all">
        {step === "input" ? (
          <div className="space-y-8">
            <div className="text-center flex flex-col items-center">
              <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="size-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Lupa Kata Sandi?
              </h1>
              <p className="text-sm text-gray-500 mt-2 max-w-xs">
                Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email
                </Label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:text-green-700 transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-200 rounded-lg focus:border-green-500 focus:ring-0 shadow-none transition-all"
                  />
                </div>
                {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-all text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 size-5 animate-spin" />
                ) : null}
                {loading ? "Memproses..." : "Kirim Link Reset"}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Kembali ke Login
                </Link>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-8 text-center flex flex-col items-center">
            <div className="size-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="size-10 text-primary animate-bounce" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Email Terkirim!
              </h1>
              <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                Link reset kata sandi telah dikirim ke <span className="font-bold text-gray-900">{email}</span>. 
                Periksa kotak masuk Anda.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-gray-500">
              Email tidak masuk? Cek folder spam atau{" "}
              <button
                onClick={() => setStep("input")}
                className="text-green-600 font-bold hover:underline"
              >
                kirim ulang
              </button>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-lg font-bold border-gray-200 rounded-lg shadow-sm hover:bg-slate-50"
            >
              <Link href="/login">Kembali ke Login</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
