import { Metadata } from "next";
import { REGISTER_META } from "@/constants/register";
import RegisterHeroSection from "@/components/sections/register/SignupHeroSection";
import RegisterFormSection from "@/components/sections/register/SignupFormSection";
import RegisterTrustBarSection from "@/components/sections/register/SignupTrustBarSection";

export const metadata: Metadata = {
  title: REGISTER_META.title,
  description: REGISTER_META.description,
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen">
      <RegisterHeroSection />
      <RegisterFormSection />
      {/* <RegisterTrustBarSection /> */}
    </div>
  );
}

