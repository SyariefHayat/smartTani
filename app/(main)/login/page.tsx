import { Metadata } from "next";
import { LOGIN_META } from "@/constants/login";
import HeroLoginSection from "@/components/sections/login/HeroLoginSection";
import { LoginForm } from "@/components/sections/login/LoginForm";

export const metadata: Metadata = {
  title: LOGIN_META.title,
  description: LOGIN_META.description,
};

export default function LoginPage() {
  return (
    <main className="bg-white">
      <HeroLoginSection />
      
      <section className="py-16 md:py-24">
        <div className="container-smarttani">
          <div className="flex justify-center px-4">
            <LoginForm className="w-full max-w-md" />
          </div>
        </div>
      </section>
    </main>
  );
}