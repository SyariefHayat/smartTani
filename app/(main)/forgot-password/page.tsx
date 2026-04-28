import { Metadata } from "next";
import ForgotPasswordSection from "@/components/sections/login/ForgotPasswordSection";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen">
      <ForgotPasswordSection />
    </main>
  );
}
