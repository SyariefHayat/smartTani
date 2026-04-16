import { Metadata } from "next";
import { SIGNUP_META } from "@/constants/signup";
import SignupHeroSection from "@/components/sections/signup/SignupHeroSection";
import SignupFormSection from "@/components/sections/signup/SignupFormSection";
import SignupTrustBarSection from "@/components/sections/signup/SignupTrustBarSection";

export const metadata: Metadata = {
  title: SIGNUP_META.title,
  description: SIGNUP_META.description,
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
