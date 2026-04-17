import React from "react";
import LoginHeader from "./LoginHeader";
import LoginMembership from "./LoginMembership";
import LoginForm from "./LoginForm";
import LoginTrustBar from "./LoginTrustBar";

export default function LoginSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/signup/login.webp')",
          filter: "brightness(0.9)"
        }}
      />
      
      {/* Decorative Overlay */}
      <div className="absolute inset-0 z-1 bg-black/10" />

      {/* Login Card Container */}
      <div className="relative z-10 w-full max-w-5xl bg-white/95 backdrop-blur-sm rounded-[2.5rem] shadow-xl p-8 md:p-12 lg:p-16 transform transition-all">
        <LoginHeader />
        <LoginMembership />
        <LoginForm />
        <LoginTrustBar />
      </div>
    </section>
  );
}
