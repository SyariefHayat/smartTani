"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative grid h-svh lg:grid-cols-2 overflow-hidden bg-white">
      {/* Background for Mobile/Tablet with Dark Overlay */}
      <div className="absolute inset-0 lg:hidden">
        <Image
          src="/images/register/login-hero.webp"
          alt="Smarttani Mobile Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Left Column — Form */}
      <div className="relative flex flex-col gap-4 p-6 md:p-10 z-10 overflow-y-auto lg:overflow-hidden">
        <div className="flex flex-1 items-center justify-center py-10 lg:py-0">
          <div className="w-full md:max-w-xl bg-white px-6 py-8 md:px-10 md:py-10 rounded-xl shadow-2xl lg:bg-transparent lg:p-0 lg:rounded-none lg:shadow-none">

            {/* Logo — hanya tampil di mobile, di desktop ada di sisi kanan */}
            <Link href="/" className="flex items-center justify-center lg:hidden mb-6">
              <div className="relative w-full max-w-[260px]">
                <Image
                  src="/images/register/logo.png"
                  alt="Smarttani Logo"
                  width={260}
                  height={50}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </Link>

            <LoginForm />
          </div>
        </div>
      </div>

      {/* Right Column — Desktop Side Image */}
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/images/register/login-hero.webp"
          alt="Smarttani Desktop Background"
          fill
          className="absolute inset-0 h-full w-full object-cover"
          priority
        />
        {/* ✅ Overlay solid penuh, sama seperti mobile */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col justify-between p-12">

          {/* Logo di pojok kiri atas sisi kanan */}
          <Link href="/">
            <Image
              src="/images/register/logo.png"
              alt="Smarttani Logo"
              width={160}
              height={50}
              className="h-auto w-auto object-contain"
              priority
            />
          </Link>

          {/* Teks di bagian bawah */}
          <div className="text-white max-w-md">
            <h2 className="text-3xl font-bold mb-4 leading-tight">Selamat Datang Di <br /> PT. SmartTani Indonesia</h2>
            <p className="text-white/80 leading-relaxed text-lg">
              Bersama petani, membangun pertanian modern, berkelanjutan dan berdaya saing untuk masa depan yang lebih baik.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6 w-full", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Masuk ke Akun</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Masukkan email Anda untuk mengakses dashboard Smarttani
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="email" className="text-gray-700">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="nama@email.com"
            required
            className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password" className="text-gray-700">Password</FieldLabel>
            <Link
              href="/forgot-password"
              className="ml-auto text-sm font-semibold text-[#1A6B2F] hover:underline underline-offset-4"
            >
              Lupa Password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
          />
        </Field>
        <Field>
          <Button
            type="submit"
            className="w-full bg-[#1A6B2F] hover:bg-[#145224] rounded-xl h-12 text-base font-bold shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all"
          >
            Masuk Sekarang
          </Button>
        </Field>
        <FieldSeparator className="text-gray-400">Atau masuk dengan</FieldSeparator>
        <Field>
          <Button
            variant="outline"
            type="button"
            className="w-full rounded-xl h-12 border-gray-200 hover:bg-gray-50 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            Google
          </Button>
          <FieldDescription className="text-center mt-4 text-gray-500">
            Belum punya akun?{" "}
            <Link href="/register" className="font-bold text-[#1A6B2F] hover:underline">
              Daftar Gratis
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}