import { Metadata } from "next";
import ForgotPassword from "@/components/sections/login/ForgotPassword";

export const metadata: Metadata = {
  title: "Lupa Kata Sandi",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen">
      <ForgotPassword />
    </main>
  );
}
