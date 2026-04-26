import { Metadata } from "next";
import { REGISTER_META } from "@/constants/register";
import SignupHeroSection from "@/components/sections/register/SignupHeroSection";
import SignupFormSection from "@/components/sections/register/SignupFormSection";
import SignupTrustBarSection from "@/components/sections/register/SignupTrustBarSection";

export const metadata: Metadata = {
  title: REGISTER_META.title,
  description: REGISTER_META.description,
};

export default function SignupPage() {
  return (
    <div className="min-h-screen">
      <SignupHeroSection />
      <SignupFormSection />
      <SignupTrustBarSection />
    </div>
  );
}

