"use client";

import React from "react";
import Link from "next/link";
import { LOGIN_FORM } from "@/constants/login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {LOGIN_FORM.title}
        </h2>
      </div>

      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
                placeholder={LOGIN_FORM.emailPlaceholder}
                className="pl-10 h-12 border-gray-200 rounded-lg focus:border-green-500 focus:ring-0 shadow-none transition-all"
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
                placeholder={LOGIN_FORM.passwordPlaceholder}
                className="pl-10 pr-10 h-12 border-gray-200 rounded-lg focus:border-green-500 focus:ring-0 shadow-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <Button className="w-full h-12 text-lg font-bold bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-all text-white">
          <LogIn className="mr-2" size={20} />
          {LOGIN_FORM.submitButton}
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
