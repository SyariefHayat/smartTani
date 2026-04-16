import Image from "next/image";
import { SIGNUP_HERO } from "@/constants/signup";

export default function SignupHeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#17391f]">
      {/* Background Image Wrapper */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/signup/Hero-background.webp"
          alt="Hero Background"
          fill
          className="object-cover object-right-top lg:object-center"
          priority
        />
        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17391f] via-[#17391f]/80 to-[#17391f]/40 lg:via-[#17391f]/60 lg:to-transparent" />
      </div>

      <div className="container-smarttani relative z-10 py-10 md:py-14 lg:py-16">
        <div className="max-w-2xl text-white">
          {/* Badge */}
          <div className="inline-block rounded-lg bg-white/10 backdrop-blur-sm px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white">
            {SIGNUP_HERO.badge}
          </div>

          {/* Headings */}
          <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
            {SIGNUP_HERO.heading}
          </h1>

          {/* Subtext */}
          <p className="mt-6 max-w-xl text-sm font-medium text-white/90 md:text-base">
            <span className="flex items-start gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#b5d296]" />
              {SIGNUP_HERO.subtext}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
