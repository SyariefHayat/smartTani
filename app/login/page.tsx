import { Metadata } from "next";
import { LOGIN_META } from "@/constants/login";
import LoginSection from "@/components/sections/login/LoginSection";

export const metadata: Metadata = {
  title: LOGIN_META.title,
  description: LOGIN_META.description,
};

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <LoginSection />
    </main>
  );
}
