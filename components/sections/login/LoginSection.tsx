import React from "react";
import LoginHeader from "./LoginHeader";
import LoginMembership from "./LoginMembership";
import LoginTrustBar from "./LoginTrustBar";
import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "./LoginForm";

export default function LoginSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/register/login-hero.webp')",
          filter: "brightness(0.9)"
        }}
      />

      {/* Decorative Overlay */}
      <div className="absolute inset-0 z-1 bg-black/50" />

      <div className="flex w-full max-w-sm flex-col gap-6 relative z-10">
        <a href="#" className="flex items-center self-center">
          <img
            src="/images/register/logo.png"
            alt="SmartTani"
            width={480}
            height={100}
            className="object-contain"
          />
        </a>
        <LoginForm />
      </div>
    </section>
  );
}
