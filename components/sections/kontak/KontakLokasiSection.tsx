import { KONTAK_LOKASI } from "@/constants/kontak";
import { CheckCircle2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function KontakLokasiSection() {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container-smarttani">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left Side: Text and Bullets */}
          <div>
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl">
              {KONTAK_LOKASI.heading}
            </h2>
            <p className="mt-2 text-sm font-medium text-gray-500 md:text-base">
              {KONTAK_LOKASI.subtext}
            </p>

            <div className="mt-8 space-y-4">
              {KONTAK_LOKASI.bullets.map((bullet) => (
                <div key={bullet} className="flex items-center gap-3">
                  <CheckCircle2 className="size-5 text-[#2D6A2D]" />
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

          {/* Right Side: Map Image Container */}
          <div className="relative aspect-video w-full overflow-hidden rounded-[2.5rem] border-8 border-white bg-white shadow-2xl shadow-slate-200">
            {/* 
              Mockup map image. In real app, could be an iframe or dynamic map.
              Using a placeholder or static image as per requirements.
            */}
            <div className="absolute inset-0 bg-slate-200">
               {/* Marker Placeholder */}
               <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  <div className="rounded-2xl bg-[#17391f] p-3 text-white shadow-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#b5d296]">Smarttani</p>
                    <p className="text-[9px] font-medium leading-tight text-white/80">PT. Smarttani Indonesia</p>
                  </div>
                  <div className="size-4 -mt-1 rotate-45 bg-[#17391f]" />
                  <div className="size-3 rounded-full bg-[#17391f] ring-4 ring-white/50" />
               </div>

               {/* Map Background Illustration Style */}
               <div className="absolute inset-0 opacity-40 mix-blend-multiply grayscale">
                  <Image
                    src="/images/distributor/map.webp"
                    alt="Map Background"
                    fill
                    className="object-cover"
                  />
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
