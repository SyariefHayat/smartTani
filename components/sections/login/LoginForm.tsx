"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LOGIN_FORM } from "@/constants/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2, CheckCircle2 } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const auth = localStorage.getItem("smarttani-auth");
    if (auth) {
      try {
        const user = JSON.parse(auth);
        if (user.role === "investor") {
          router.push("/dashboard/investor");
        } else {
          router.push("/dashboard/petani");
        }
      } catch (e) {}
    }

    if (searchParams.get("registered") === "true") {
      setIsRegistered(true);
    }
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);

    if (!email || !password) {
      setError(true);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Dummy authentication logic
    const role = email.toLowerCase().includes("investor") ? "investor" : "petani";
    const name = email.split("@")[0] || "User";
    
    localStorage.setItem(
      "smarttani-auth",
      JSON.stringify({ email, name, role })
    );

    // Trigger storage event for other tabs/components
    window.dispatchEvent(new Event("storage"));

    const redirect = searchParams.get("redirect");
    if (redirect) {
      router.push(redirect);
    } else if (role === "investor") {
      router.push("/dashboard/investor");
    } else {
      router.push("/dashboard/petani");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {LOGIN_FORM.title}
        </h2>
      </div>

      {isRegistered && (
        <div className="flex items-center gap-3 p-4 mb-6 text-sm text-green-800 rounded-lg bg-green-50 border border-green-200">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <span className="font-medium">✓ Akun berhasil dibuat! Silakan masuk.</span>
        </div>
      )}

      {error && (
        <div className="animate-[shake_0.5s_ease-in-out] flex items-center p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200">
          <span className="font-medium">Email atau kata sandi tidak valid. Silakan coba lagi.</span>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Email / No HP */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              {LOGIN_FORM.emailLabel}
            </Label>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:text-green-700 transition-colors">
                <Mail size={18} />
              </div>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={LOGIN_FORM.emailPlaceholder}
                className="pl-10 h-12 border-gray-200 rounded-lg focus:border-green-500 focus:ring-0 shadow-none transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                {LOGIN_FORM.passwordLabel}
              </Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                {LOGIN_FORM.forgotPassword}
              </Link>
            </div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 group-focus-within:text-green-700 transition-colors">
                <Lock size={18} />
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={LOGIN_FORM.passwordPlaceholder}
                className="pl-10 pr-10 h-12 border-gray-200 rounded-lg focus:border-green-500 focus:ring-0 shadow-none transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <Button 
          type="submit"
          disabled={loading}
          className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-all text-white"
        >
          {loading ? (
            <Loader2 className="mr-2 size-5 animate-spin" />
          ) : (
            <LogIn className="mr-2 size-5" />
          )}
          {loading ? "Memproses..." : LOGIN_FORM.submitButton}
        </Button>

        <p className="text-center text-gray-600">
          {LOGIN_FORM.registerPrompt}{" "}
          <Link
            href="/signup"
            className="text-green-600 font-bold hover:underline"
          >
            {LOGIN_FORM.registerLink}
          </Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="animate-spin text-green-600 size-8" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
