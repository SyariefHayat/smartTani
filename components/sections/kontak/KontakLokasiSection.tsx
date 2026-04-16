import { KONTAK_LOKASI } from "@/constants/kontak";
import { CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function KontakLokasiSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container-smarttani">
        {/* Single Unified Card */}
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200/60 transition-all hover:shadow-green-900/5">
          {/* Map Image as Full Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src={KONTAK_LOKASI.mapImage}
              alt="Lokasi Smarttani"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20 lg:via-white/80 lg:to-transparent" />
          </div>

          <div className="relative z-10 grid lg:grid-cols-2">
            {/* Left Side Content */}
            <div className="p-8 md:p-12 lg:p-16">
              <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl lg:text-4xl">
                {KONTAK_LOKASI.heading}
              </h2>
              <p className="mt-4 text-sm font-medium text-gray-500 md:text-base">
                {KONTAK_LOKASI.subtext}
              </p>

              <div className="mt-8 space-y-4">
                {KONTAK_LOKASI.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-center gap-3">
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EAF3DE]">
                      <CheckCircle2 className="size-4 text-[#2D6A2D]" />
                    </div>
                    <span className="text-sm font-bold text-[#17391f] md:text-base">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                <Button className="rounded-xl bg-[#2D6A2D] px-8 py-6 text-sm font-bold text-white hover:bg-[#235323] md:text-base shadow-lg shadow-green-100 transition-all active:scale-[0.98]">
                  {KONTAK_LOKASI.button}
                  <ExternalLink className="ml-2 size-5" />
                </Button>
              </div>
            </div>

            {/* Right Side Spacer (Visual Balance) */}
            <div className="min-h-[250px] lg:min-h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
